const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Item = require("../models/Item");
const Order = require("../models/Order");
const axios = require("axios");

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
    const { firstName, lastName, email, contactNumber, password, dateOfBirth, captcha } = req.body;

    if (!email.endsWith(".iiit.ac.in")) {
        return res.status(400).json({ message: "Email must end with iiit.ac.in ! Please try again" });
    }
    if (!/^\d{10}$/.test(contactNumber)) {
        return res.status(400).json({ message: "Invalid contact number ! Please try again" });
    }
    if(!captcha) {
        return res.status(400).json({ message: "ReCAPTCHA failed !" });
    }
    try {
        const recaptchares= await axios.post("https://www.google.com/recaptcha/api/siteverify",null, {
            params: {
                secret: "6Lc9SsoqAAAAAIWLNzUit-EYgFSMAFBVkhgAwQ7i",
                response: captcha,
            },
        });
        if(!recaptchares.data.success) {
            return res.status(400).json({ message: "ReCAPTCHA failed !" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ firstName, lastName, email, contactNumber, password: hashedPassword, dateOfBirth });
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists ! sign in with different email" });
        }
        await newUser.save();
        res.status(200).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(400).json({ message: "User registration failed" });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password, captcha } = req.body;
    if(!captcha) {
        return res.status(400).json({ message: "ReCAPTCHA failed !" });
    }
    try {
        const recaptchares= await axios.post("https://www.google.com/recaptcha/api/siteverify",null, {
            params: {
                secret: "6Lc9SsoqAAAAAIWLNzUit-EYgFSMAFBVkhgAwQ7i",
                response: captcha,
            },
        });
        if(!recaptchares.data.success) {
            return res.status(400).json({ message: "ReCAPTCHA failed !" });
        }
        const user_found = await User.findOne({ email });
        if (user_found && (await bcrypt.compare(password, user_found.password))) {
            res.status(200).json({ message: 'Login successful', user: user_found });
        } else {
            res.status(400).json({ message: "Invalid Credentials ! Please try again" });
        }
    }catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
});

module.exports = router;