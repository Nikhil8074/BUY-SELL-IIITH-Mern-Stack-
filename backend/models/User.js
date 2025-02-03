const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    contactNumber: String,
    password: String,
    dateOfBirth: String
});

module.exports = mongoose.model("User", userSchema);