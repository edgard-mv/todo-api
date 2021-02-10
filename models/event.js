const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    guests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    start: {
        type: Date,
        min: Date.now,
        required: true
    },
    end: {
        type: Date,
        min: Date.now
    },
    done: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Event', eventSchema);
