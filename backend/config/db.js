const mongoose = require("mongoose");

const mongoURI = 'mongodb+srv://Nikhil:Pandu8074@buysell.5kz7y.mongodb.net/?retryWrites=true&w=majority&appName=buysell';

const connect = () => {
    mongoose
        .connect(mongoURI)
        .then(() => console.log("MongoDB connected"))
        .catch((err) => console.log(err));
};

module.exports = { connect };