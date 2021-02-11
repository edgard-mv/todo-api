const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    lists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List'
    }]
});

module.exports = mongoose.model('User', userSchema);
