const router = require('express').Router();
const listRouter = require('./lists');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;

// models
const User = require('../models/user');

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.sendStatus(503);
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ 'msg': 'A email and password must be provided.' });
    
    try {
        const user = await User.findOne({
            email: email
        }).exec();
        // if no user is found, return error
        if (!user) return res.status(404).json({ 'msg': `Error. No such user with email ${email}` });

        // password comparison
        if (await bcrypt.compare(password, user.password)) {
            return res.json(user);
        } else {
            return res.status(401).json({ 'msg': 'Error. Provided credentials are not valid.' });
        }
    } catch (err) {
        res.sendStatus(503);
    }
});

router.get('/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).exec();
        res.json(user);
    } catch (err) {
        res.sendStatus(404);
    }
});

router.post('/', async (req, res) => {
    const values = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };
    
    // check for missing values
    const missingValues = [];
    for (const field in values) {
        if (!values[field]) missingValues.push(field);
    }
    // if anything is missing return error
    if (missingValues.length) return res.status(400).json({
        'msg': `Error. The following values were missing: ${missingValues.join(', ')}.`
    });

    // encrypt password
    try {
        const hashedPass = await bcrypt.hash(values.password, SALT_ROUNDS);
        values.password = hashedPass;
    } catch (err) {
        return res.status(503).json({ 'msg': 'Error. There seems to be a error, try again later.' });
    }
    // create user and try to store it
    const user = new User(values);
    
    try {
        const u = await user.save();
        res.status(201).json(u);
    } catch (err) {
        res.json({ 'msg': `Error: ${err}` });
    }
});

router.use('/:username/lists', (req, res, next) => {
    req.username = req.params.username;
    next();
}, listRouter);

module.exports = router;
