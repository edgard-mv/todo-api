// models
const User = require('../models/user');

exports.get = async(req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).exec();
        res.json(user);
    } catch (err) {
        res.sendStatus(404);
    }
};

module.exports = exports;
