const router = require('express').Router();
const userController = require('../controllers/userController');
const listRouter = require('./lists');

router.post('/login', userController.login);

router.get('/:username', userController.get);

router.post('/', userController.create);

// use nested router for lists
router.use('/:username/lists', (req, res, next) => {
    req.username = req.params.username;
    next();
}, listRouter);

module.exports = router;
