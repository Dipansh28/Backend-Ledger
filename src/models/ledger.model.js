const mongoose = require("mongoose");



const ledgerSchema = new mongoose.Schema({
    account:{
        type: mongoose.Schema.Types.ObjectID,
        ref: "account",
        required: [ true, "Ledger must be associated with an account" ],
        index: true,
        immutable: true
    },
    amount: {
        type: Number,
        required: [ true, "Amount is required for creating a ledger entry" ],
        immutable: true
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "transaction",
        required: [ true, "Ledger must be associated with a transaction" ],
        index: true,
        immutable: true
    },
    type: {
        type: String,
        enum: {
            values: [ "CREDIT", "DEBIT" ],
            message: "Type can be either CREDIT OR DEBIT",
        },
        required: [ true, "Ledger type is required" ],
        immutable: true
    }
})

// function preventLedgerModification() {
//    throw new Error("Ledger entries are immutable and cannot be modified or deleted");
// }

// ledgerSchema.pre('findOneAndUpdate', preventLedgerModification);
// ledgerSchema.pre('updateOne', preventLedgerModification);
// ledgerSchema.pre('deleteOne', preventLedgerModification);
// ledgerSchema.pre('remove', preventLedgerModification);
// ledgerSchema.pre('deleteMany', preventLedgerModification);

function preventLedgerModification() {
    throw new Error("Ledger entries are immutable and cannot be modified or deleted");
}

// ✅ Update operations
ledgerSchema.pre('findOneAndUpdate', preventLedgerModification);
ledgerSchema.pre('updateOne', preventLedgerModification);  // ✅ Fix: was 'uodateOne' (typo)
ledgerSchema.pre('updateMany', preventLedgerModification);
ledgerSchema.pre('findByIdAndUpdate', preventLedgerModification);
ledgerSchema.pre('replaceOne', preventLedgerModification);

// ✅ Delete operations
ledgerSchema.pre('deleteOne', preventLedgerModification);
ledgerSchema.pre('deleteMany', preventLedgerModification);
ledgerSchema.pre('findOneAndDelete', preventLedgerModification);
ledgerSchema.pre('findByIdAndDelete', preventLedgerModification);
ledgerSchema.pre('remove', preventLedgerModification);

// ✅ Bulk operations
ledgerSchema.pre('bulkWrite', preventLedgerModification);


const ledgerModel = mongoose.model('ledger', ledgerSchema);

module.exports = ledgerModel;