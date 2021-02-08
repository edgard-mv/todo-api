const express = require('express');

const List = require('../models/list');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const lists = await List.find();
        res.json(lists);
    } catch (err) {
        res.sendStatus(503);
    }
});

router.post('/', async (req, res) => {
    const list = new List({
        user: req.body.user,
        title: req.body.title,
    });
    
    try {
        const l = await list.save();
        res.json(l);
    } catch (err) {
        res.send('Error: ' + err);
    }
});

module.exports = router;
