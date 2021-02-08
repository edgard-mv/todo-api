const express = require('express');

const User = require('../models/user');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.sendStatus(503);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (err) {
        res.sendStatus(404);
    }
})

router.post('/', async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    
    try {
        const u = await user.save();
        res.json(u);
    } catch (err) {
        res.send('Error: ' + err);
    }
});

module.exports = router;
