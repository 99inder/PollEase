const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    options: [
        {
            text: {
                type: String,
                required: true,
            },
            votes: {
                type: Number,
                default: 0,
            },
            voters: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }],
        }
    ],
    totalVotes: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Poll', pollSchema);
