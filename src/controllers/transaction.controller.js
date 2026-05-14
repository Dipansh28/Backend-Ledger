const transactionModel = require('../models/transaction.model')
const ledgerModel = require("../models/ledger.model");
const accountModel = require('../models/account.model')
const userModel = require("../models/user.model")
const emailService = require("../services/email.service")
const mongoose = require("mongoose")


/**
 * - Create a new trsnsaction
 * THE 10-STEP TRANSFER FLOW:
    * 1. Validate request
    * 2. Validate idempotency key
    * 3. Check account status
    * 4. Derive sender balance from ledger
    * 5. Create transaction (Pending)
    * 6. Create DEBIT ledger entry 
    * 7. Create CREDIT ledger entry 
    * 8. Mark transaction COMPLETED
    * 9. Commit MongoDB session
    * 10. Send email notification
 *  */

/**
 * 1. Validate request
 */

 async function createTransaction( req, res ) {
    
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body

    if ( !fromAccount || !toAccount || amount === undefined || amount === null || !idempotencyKey ) {
        return res.status(400).json({
            message: "FromAccount, toAccount, amount and idempotencyKey are required. "
        })
    }

    const amountNum = Number(amount)
    if (Number.isNaN(amountNum) || amountNum <= 0) {
        return res.status(400).json({
            message: "Amount must be a positive number."
        })
    }

    if (String(fromAccount) === String(toAccount)) {
        return res.status(400).json({
            message: "fromAccount and toAccount must be different."
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount
    })

    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })

    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message: "Invalid fromAccount or toAccount."
        })
    }

    const requester = await userModel.findById(req.user._id).select("+systemUser")
    const fromOwnerId = String(fromUserAccount.user)
    const sessionUserId = String(req.user._id)
    const ownsFromAccount = fromOwnerId === sessionUserId

    // Normal users may only debit their own accounts. System users may debit any (mint/admin flows).
    if (!ownsFromAccount && !requester?.systemUser) {
        return res.status(403).json({
            message:
                "fromAccount is not yours for this login. Log in as the user who owns fromAccount, or set fromAccount to one of your accounts (GET /api/accounts/me). System users may transfer from any account."
        })
    }

/**
 * 2. Validate idempotency key
 */

    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })

    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status === "COMPLETED"){
          return res.status(200).json({
                message: "Transaction already completed.",
                transaction: isTransactionAlreadyExists
            })
        }

        if(isTransactionAlreadyExists.status === "PENDING"){
            return res.status(200).json({
                message: "Transaction already processing."
            })
        }

        if(isTransactionAlreadyExists.status === "FAILED"){
            return res.status(200).json({
                message: "Transaction processing failed, please try again."
            })
        }

        if(isTransactionAlreadyExists.status === "REVERSED"){
            return res.status(200).json({
                message: "Transaction already reversed."
            })
        }
    }

/**
 * 3. Check account status
 */

    if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
        return res.status(400).json({
            message: "Both fromAccount and toAccount must be active to perform a transaction."
        })
    }

/**
  * 4. Derive senders balance from ledger 
*/

  const balance = await fromUserAccount.getBalance()

   if(balance < amountNum){
    return res.status(400).json({
        message: `Insufficient balance in the account. Current balance is ${balance}. 
        Requested amount is ${amountNum}. Please add funds to your account.`
    })
   }

/**
  * 5. Create transaction (PENDING)  
 */   

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const created = await transactionModel.create([{
      fromAccount,
      toAccount,
      amount: amountNum,
      idempotencyKey,
      status: "PENDING"
    }], { session })
    const transaction = created[0]

    await ledgerModel.create([{
      account: fromAccount,
      amount: amountNum,
      transaction: transaction._id,
      type: "DEBIT"
    }], { session })

    await (() => {
        return new Promise((resolve) => setTimeout(resolve, 15 * 1000));
    })()

    await ledgerModel.create([{
      account: toAccount,
      amount: amountNum,
      transaction: transaction._id,
      type: "CREDIT"
    }], { session })

    transaction.status = "COMPLETED"
    await transaction.save({ session })

    await session.commitTransaction()

    await emailService.sendTransactionEmail(req.user.email, req.user.name, amountNum, toAccount)

    return res.status(200).json({
      message: "Transaction completed successfully.",
      transaction
    })
  } catch (error) {
    await session.abortTransaction()
    return res.status(500).json({
      message: error.message || "Transaction failed."
    })
  } finally {
    session.endSession()
  }

}

async function createInitialFundsTransaction(req, res){
    const {toAccount, amount, idempotencyKey} = req.body

    if(!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message: "toAccount, amount and idempotencyKey are required."
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    })

    if(!toUserAccount){
        return res.status(400).json({
            message: "Invalid toAccount."
        })
    }

   const session = await mongoose.startSession()
    session.startTransaction()
    try{
        let fromUserAccount = await accountModel.findOne({
            user: req.user._id,
            status: "ACTIVE"
        }).session(session)

        // Auto-create system account for first-time initial funding.
        if(!fromUserAccount){
            const createdAccounts = await accountModel.create([{
                user: req.user._id,
                status: "ACTIVE",
                currency: toUserAccount.currency || "INR"
            }], { session })
            fromUserAccount = createdAccounts[0]
        }

        const transactions = await transactionModel.create([{
            fromAccount: fromUserAccount._id,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        }], { session })
        const transaction = transactions[0]

        await ledgerModel.create([{
            account: fromUserAccount._id,
            amount: amount,
            transaction: transaction._id,
            type: "DEBIT"
        }], { session })

        await ledgerModel.create([{
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        }], { session })

        transaction.status = "COMPLETED"
        await transaction.save({ session })

        await session.commitTransaction()

        return res.status(201).json({
            message: "Initial funds transaction completed successfully",
            transaction: transaction
        })
    } catch (error) {
        await session.abortTransaction()
        return res.status(500).json({
            message: error.message || "Unable to process initial funds transaction."
        })
    } finally {
        session.endSession()
    }

}


module.exports = {
    createTransaction,
    createInitialFundsTransaction,
}