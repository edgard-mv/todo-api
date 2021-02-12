// models
const User = require('../models/user');
const List = require('../models/list');

exports.getByUsername = async(req, res) => {
    const username = req.username;
    
    try {
        const user = await User.findOne({ username }).populate('lists').exec();

        if (!user) return res.status(400).json({ 'msg': `Error. No user with username: ${username}` });
        
        if (user.populated('lists')) return res.json(user.lists);
        
        res.status(404).json({ 'msg': `No lists for user: ${user}`} );
    } catch (err) {
        res.json({ 'msg': `Error: ${err}` });
    }
};

exports.create = async(req, res) => {
    const username = req.username;
    const listTitle = req.body.title;
    if (!listTitle) return res.status(400).json({ 'msg': 'Error. You must provide a title' }); 
    
    try {
        const user = await User.findOne({ username }).exec();

        if (!user) return res.status(400).json({ 'msg': `Error. No user with username: ${username}` });

        const list = new List({
            user: user._id,
            title: listTitle,
        });
        const l = await list.save();
        
        user.lists.push(l);
        await user.save();

        res.json(l);
    } catch (err) {
        res.json({ 'msg': `Error: ${err}` });
    }
};

exports.removeByUsername = async(req, res) => {
    const username = req.username;
    const listId = req.params.listId;

    
    try {
        const user = await User.findOne({ username }).exec();

        if (!user) return res.status(400).json({ 'msg': `Error. No user with username: ${username}` });

        if (!user.lists.includes(listId)) return res.status(400).json({
            'msg': `Error. No list with id ${listId} for user ${username}`
        });
        
        await List.findByIdAndDelete(listId).exec();
        user.lists = user.lists.filter(list => list._id.toString() !== listId);
        await user.save();
        res.sendStatus(204);
    } catch (err) {
        res.json({ 'msg': `Error: ${err}` });
    }
};

module.exports = exports;
