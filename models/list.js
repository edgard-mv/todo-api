const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    user: {
        type: mongoose.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    tasks: [{
        name: {
            type: String,
            required: true
        },
        done: {
            type: Boolean,
            default: false
        },
        priority: {
            type: Number,
            required: true,
            min: [1, 'Value must be in range 1 to 3'],
            max: [3, 'Value must be in range 1 to 3'],
            get: v => Math.round(v),
            set: v => Math.round(v)
        }
    }]
})

module.exports = mongoose.model('List', listSchema);
