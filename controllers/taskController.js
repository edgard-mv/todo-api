const User = require('../models/user');
const List = require('../models/list');

exports.addToList = async(req, res) => {
    const { username, listId } = req;
    if (listId < 0) return res.status(400).json({ 'msg': 'Error. List id must be greater or equal to 0.' }); 
    
    if (!req.body.name || !req.body.priority) {
        return res.status(400).json({
            'msg': 'Error. A name and priority must be provided.'
        });
    }

    let priority = 0;
    try {
        priority = parseInt(req.body.priority);
        if (![1, 2, 3].includes(priority)) return res.status(400).json({
            'msg': 'Error. priority must be a positive int in range [1-3].'
        });
    } catch(err) {
        return res.status(400).json({ 'msg': 'Error. priority must be a positive int in range [1-3].' })
    }
        
    const task = {
        name: req.body.name,
        priority: priority
    };
    try {
        const user = await User.findOne({ username }).exec();

        if (!user) return res.status(400).json({ 'msg': `Error. No user with username: ${username}` });
        
        const list = await List.findById(listId);
        if (!list || !user.lists.includes(list._id)) return res.status(400).json({
            'msg': `Error. No list with id ${listId} for user ${username}`
        });
        
        list.tasks.push(task);
        list.done = false;

        const l = await list.save();
        
        res.json(l);
    } catch (err) {
        res.json({ 'msg': `Error: ${err}` });
    }
};

exports.removeFromList = async(req, res) => {
    const { username, listId } = req;
    const taskId = req.params.taskId;
    
    try {
        const user = await User.findOne({ username }).exec();

        if (!user) return res.status(400).json({ 'msg': `Error. No user with username: ${username}` });
        if (req.auth.sub !== user._id.toString()) return res.status(403).json({
            'msg': `Error. No access with given token.`
        });
        
        const list = await List.findById(listId);
        if (!list || !user.lists.includes(list._id)) return res.status(400).json({
            'msg': `Error. No list with id ${listId} for user ${username}`
        });

        
        // filter out task with given id
        list.tasks = list.tasks.filter(task => task._id.toString() !== taskId);

        let isFinished = true;
        list.tasks.forEach(task => isFinished = task.done && isFinished);
        list.done = isFinished;
        
        const l = await list.save();
        
        res.json(l);
    } catch (err) {
        res.json({ 'msg': `Error: ${err}` });
    }
};

exports.changeDoneStatus = async(req, res) => {
    const { username, listId } = req;
    const taskId = req.params.taskId;

    try {
        const user = await User.findOne({ username }).exec();

        if (!user) return res.status(400).json({ 'msg': `Error. No user with username: ${username}` });
        if (req.auth.sub !== user._id.toString()) return res.status(403).json({
            'msg': `Error. No access with given token.`
        });
        
        const list = await List.findById(listId);
        if (!list || !user.lists.includes(list._id)) return res.status(400).json({
            'msg': `Error. No list with id ${listId} for user ${username}`
        });

        // filter out task with given id
        let isFinished = true;
        list.tasks.forEach((task) => {
            if (task._id.toString() === taskId) {
                task.done = !task.done;
            }

            if (!task.done && isFinished) isFinished = false;
        });
        
        list.done = isFinished;
        
        const l = await list.save();
        
        res.json(l);
    } catch (err) {
        res.json({ 'msg': `Error: ${err}` });
    }
};

module.exports = exports;