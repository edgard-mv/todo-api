const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// todo: implement refresh tokens in db
// this needs to be implemented in db, rather than memory. It will be done later.
// because of this, refresh tokens will only be valid as long as the server is running.
let refreshTokens = [];

// todo: validate env var
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const EXP_TIME = process.env.EXP_TIME;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;

exports.login = async(req, res) => {
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
            const userValues = {
                sub: user._id,
                username: user.username,
                name: user.name,
                lists: user.lists
            }
            console.log(user);
            try {
                const accessToken = jwt.sign(userValues, Buffer.from(TOKEN_SECRET, 'base64'), { expiresIn: EXP_TIME });
                const refreshToken = jwt.sign(userValues, Buffer.from(REFRESH_SECRET, 'base64'));
                refreshTokens.push(refreshToken);

                return res.json({ accessToken, refreshToken });
            } catch(err) {
                return res.status(500).json({ 'msg': err });
            }
            
        } else {
            return res.status(401).json({ 'msg': 'Error. Provided credentials are not valid.' });
        }
    } catch (err) {
        res.sendStatus(503);
    }
};

exports.signup = async(req, res) => {
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
        return res.status(503).json({ 'msg': 'Error. There seems to be a error, try again later.' + err });
    }
    // create user and try to store it
    const user = new User(values);
    
    try {
        const u = await user.save();
        return res.status(201).json({ 'username': u.username });
    } catch (err) {
        res.json({ 'msg': `Error: ${err}` });
    }
};


exports.getToken = async(req, res) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) return res.status(401).json({ 'msg': 'Error. Token must be provided.' });
    if (!refreshTokens.includes(refreshToken)) return res.status(403).json({ 'msg': 'Error. Invalid token.' });
    jwt.verify(refreshToken, Buffer.from(REFRESH_SECRET, 'base64'), (err, user) => {
        if (err) return res.status(403).json({ 'msg': 'Error. Invalid token.' });
        const userValues = {
            sub: user._id,
            username: user.username,
            name: user.name,
            lists: user.lists
        }
        const accessToken = jwt.sign(userValues, Buffer.from(TOKEN_SECRET, 'base64'), { expiresIn: EXP_TIME });
        return res.json({ accessToken });
    });
};

exports.logout = async(req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.refreshToken);
    return res.sendStatus(204);
};

module.exports = exports;
