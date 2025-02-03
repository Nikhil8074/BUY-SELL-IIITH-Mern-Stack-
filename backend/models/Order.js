const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    buyer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    seller_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },
    Amount: Number,
    hashedOTP: String,
    status: Number
});

module.exports = mongoose.model("Order", orderSchema);