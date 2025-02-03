const express = require("express");
const Item = require("../models/Item");
const User = require("../models/User");
const Order = require("../models/Order");

const router = express.Router();

// Add Item in sell
router.post("/add-item/:email", async (req, res) => {
    const { email } = req.params;
    const { name, description, price, category } = req.body;
    const user_found = await User.findOne({ email });
    const seller_id = user_found._id;
    if (!/^\d+$/.test(price)) {
        return res.status(400).json({ message: "Price should be a number ! Please try again" });
    }
    try {
        const newItem = new Item({ name, description, price, category, seller_id });
        await newItem.save();
        res.status(200).json({ message: 'Item added successfully', item: newItem });
    } catch (error) {
        res.status(500).json({ message: "Item addition failed" });
    }
});

// Get items in sell
router.post("/user-items/:email", async (req, res) => {
    const { email } = req.params;
    const { search, categories } = req.body;
    try {
        const user_found = await User.findOne({ email });
        const orders = await Order.find({
            seller_id: user_found._id,
            status: 2
        }).select('item_id');
        const ordersids = orders.map(order => order.item_id);
        let query = {
            seller_id: user_found._id,
            _id: { $nin: ordersids }
        };
        if (search && search.trim() !== '') {
            query.name = { $regex: search, $options: 'i' };

        }
        if (categories && categories.length > 0) {
            query.category = { $in: categories };
        }
        const items = await Item.find(query);
        res.status(200).json({ message: 'Items fetched successfully', items });
    } catch (error) {
        res.status(500).json({ message: "Item fetch failed" });
    }
});

// Delete item in sell
router.delete("/remove-item/:id", async (req, res) => {
    const { id } = req.params;
    try {
        //also delete the orders with ref of itemid
        const deleted_orders = await Order.deleteMany({ item_id: id });
        const deleted_item = await Item.findByIdAndDelete(id);
        if (!deleted_item) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json({ message: 'Item deleted successfully', item: deleted_item });
    } catch (error) {
        res.status(500).json({ message: "Item deletion failed" });
    }
});

// Get items in buy
router.post('/buy-items/:email', async (req, res) => {
    const { email } = req.params;
    const { search, categories } = req.body;
    const user_found1 = await User.findOne({ email });
    if (!user_found1) {
        return res.status(404).json({ message: "User not found" });
    }

    try {
        const orderswith1 = await Order.find({
            buyer_id: user_found1._id,
            status: 1

        }).select("item_id");

        const orderswith2 = await Order.find({
            status: 2
        }).select("item_id");
        const orderIdswith1 = orderswith1.map(order => order.item_id);
        const orderIdswith2 = orderswith2.map(order => order.item_id);
        let query = {
            seller_id: { $ne: user_found1._id },
            _id: { $nin: [...orderIdswith1, ...orderIdswith2] }
        };
        if (search && search.trim() !== '') {
            query.name = { $regex: search, $options: 'i' };
        }
        if (categories && categories.length > 0) {
            query.category = { $in: categories };
        }
        const items = await Item.find(query);
        res.status(200).json({ message: "Items fetched successfully", items });
    } catch (error) {
        res.status(500).json({ message: "Item fetch failed" });
    }
});

// Item page details
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Item.findById(id).populate("seller_id", "firstName lastName email contactNumber");
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json({ message: "Item fetched successfully", item });
    } catch (error) {
        res.status(500).json({ message: "Item fetch failed" });
    }
});

module.exports = router;