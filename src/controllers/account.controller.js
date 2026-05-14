const accountModel = require("../models/account.model");
const mongoose = require("mongoose");

async function createAccountController(req, res) {
    try {
        const user = req.user;

        const account = await accountModel.create({
            user: user._id  // ✅ Fix: was user_id, should be user._id
        });

        res.status(201).json({  // ✅ Fix: was req.status, should be res.status
            account
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

async function getUserAccountsController(req, res) {
    try {
        const accounts = await accountModel.find({ user: req.user._id });
        return res.status(200).json({
            accounts
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

async function getAllAccountsController(req, res) {
    try {
        const accounts = await accountModel.find({});
        return res.status(200).json({
            accounts
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

async function getAccountBalanceController(req, res) {
    try {
        const { accountId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(accountId)) {
            return res.status(400).json({
                message: "Invalid accountId."
            });
        }

        const account = await accountModel.findById(accountId);

        if (!account) {
            return res.status(404).json({
                message: "Account not found."
            });
        }

        const balance = await account.getBalance();

        return res.status(200).json({
            accountId: account._id,
            balance
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    createAccountController,
    getUserAccountsController,
    getAllAccountsController,
    getAccountBalanceController
};