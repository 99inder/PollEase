const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    pollsCreated: [{
        type: mongoose.Schema.ObjectId,
        ref: "Polls",
    }],
    votedOn: [{
        type: mongoose.Schema.ObjectId,
        ref: "Polls",
    }]
})

module.exports = mongoose.model("User", userSchema);