const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Item = require("../models/Item");
const Order = require("../models/Order");

const router = express.Router();

// Edit Profile
router.put("/edit-profile/:email", async (req, res) => {
    const { email } = req.params;
    const { firstName, lastName, contactNumber, dateOfBirth } = req.body;
    if (!/^\d{10}$/.test(contactNumber)) {
        return res.status(400).json({ message: "Invalid contact number ! Please try again" });
    }
    try {
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { $set: { firstName, lastName, contactNumber, dateOfBirth } },
            { new: true }
        );
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Profile update failed" });
    }
});

// Change Password
router.put("/change-password/:email", async (req, res) => {
    const { email } = req.params;
    const { currentPassword, newPassword } = req.body;
    try {
        const user_found = await User.findOne({ email });
        if (user_found && (await bcrypt.compare(currentPassword, user_found.password))) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const updatedUser = await User.findOneAndUpdate(
                { email },
                { $set: { password: hashedPassword } },
                { new: true }
            );
            res.status(200).json({ message: 'Password updated successfully', user: updatedUser });
        } else {
            res.status(400).json({ message: "Invalid Current Password ! Please try again" });
        }
    } catch (error) {
        res.status(500).json({ message: "Password update failed" });
    }
});

//history

router.get("/history/:email", async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const pendingOrders = await Order.find({ buyer_id: user._id, status: 1 }).populate("item_id").populate("seller_id");
        const boughtItems = await Order.find({ buyer_id: user._id, status: 2 }).populate("item_id").populate("seller_id");
        const cancelledOrders = await Order.find({ buyer_id: user._id, status: 3 }).populate("item_id").populate("seller_id");
        const soldItems = await Order.find({ seller_id: user._id, status: 2 }).populate("item_id");

        res.status(200).json({ message: "Order history fetched successfully", pendingOrders, boughtItems, cancelledOrders, soldItems });
    } catch (error) {
        res.status(500).json({ message: "Order history fetch failed" });
    }
});

module.exports = router;