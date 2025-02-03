const express = require("express");
const bcrypt = require("bcrypt");
const Order = require("../models/Order");
const User = require("../models/User");
const Item = require("../models/Item");

const router = express.Router();

// In cart or not check
router.get('/in_cart/:user_id/:item_id', async (req, res) => {
    const { user_id, item_id } = req.params;
    try {
        const order1 = await Order.findOne({ buyer_id: user_id, item_id: item_id });
        if (!order1) {
            return res.status(404).json({ message: "false" });
        }
        res.status(200).json({ message: "true", order1 });
    } catch (error) {
        res.status(500).json({ message: "Order fetch failed" });
    }
});

// Add to cart
router.post('/cart/add_to_cart', async (req, res) => {
    const { user_id, item_id } = req.body;
    try {
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const item = await Item.findById(item_id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        const neworder = new Order({ buyer_id: user_id, seller_id: item.seller_id, item_id: item_id, Amount: item.price, hashedOTP: "", status: 0 });
        await neworder.save();
        res.status(200).json({ message: "Item added to cart successfully", neworder });
    } catch (error) {
        res.status(500).json({ message: "Item addition to cart failed" });
    }
});

// Remove from cart
router.post('/cart/remove_from_cart', async (req, res) => {
    const { user_id, item_id } = req.body;
    try {
        const order = await Order.findOneAndDelete({ buyer_id: user_id, item_id: item_id });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Item removed from cart successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Item removal from cart failed" });
    }
});

// Cart details
router.get('/cart/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const ordersincart = await Order.find({ buyer_id: user._id, status: 0 });

        let totalAmount = 0;
        for (const order of ordersincart) {
            totalAmount += order.Amount;
        }
        const itemsinCart = await Item.find({ _id: { $in: ordersincart.map(order => order.item_id) } }).populate("seller_id");
        res.status(200).json({ message: "Cart details fetched successfully", itemsinCart, totalAmount });

    } catch (error) {
        res.status(500).json({ message: "Cart details fetch failed" });
    }
});

// Cart buy_now
router.post('/cart/buy_now', async (req, res) => {
    const { user_id } = req.body;
    try {
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const orders = await Order.find({ buyer_id: user_id, status: 0 });
        for (const order of orders) {
            order.status = 1;
            await order.save();
        }
        res.status(200).json({ message: "Cart buy now successfully" });
    } catch (error) {
        res.status(500).json({ message: "Cart buy now failed" });
    }
});

//genearte-otp:
router.post('/generate-otp', async (req, res) => {
    const { order_id, otp } = req.body;
    try {
        const hashedOTP= await bcrypt.hash(otp.toString(), 10);
        const order = await Order.findById(order_id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.hashedOTP = hashedOTP;
        await order.save();
        res.status(200).json({ message: "OTP generated successfully", order });
    } catch (error) {
        res.status(500).json({ message: "OTP generation failed" });
    }
    
});

router.get('/delivery/:user_id', async (req, res) => {

    const { user_id } = req.params;
    try {
        const ordersdel = await Order.find({ seller_id: user_id, status: 1 }).populate("item_id").populate("seller_id");
        const uniqueItems = [];
        const itemset = new Set();
        for (const order of ordersdel) {
           if(!itemset.has(order.item_id._id.toString())) {
            uniqueItems.push(order.item_id);
            itemset.add(order.item_id._id.toString());
           }
        }
        res.status(200).json({ message: "Orders fetched successfully", items : uniqueItems });
    } catch (error) {
        res.status(500).json({ message: "Orders fetch failed" });
    }

});

router.post('/check_otp', async (req, res) => {
    const { user_id, item_id, otp } = req.body;
    try {
        const ordersotp = await Order.find({ seller_id: user_id, item_id: item_id });

        if(ordersotp.length == 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        let otpverify = false;
        for( let order of ordersotp) {
            if(await bcrypt.compare(otp.toString(), order.hashedOTP)) {
                order.status = 2;
                await order.save();
                otpverify = true;
            }
        }
        if(otpverify) {
            for( let order1 of ordersotp) {
                if(order1.status == 1) {
                    order1.status = 3;
                    await order1.save();
                }
            }
            res.status(200).json({ message: "OTP verified successfully" });
        }
        else {
            res.status(401).json({ message: "OTP did not matched" });
        }
    } catch (error) {
        res.status(500).json({ message: "OTP check failed" });
    }
});

module.exports = router;