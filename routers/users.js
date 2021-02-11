const router = require('express').Router();
const userController = require('../controllers/userController');
const listRouter = require('./lists');

// every route is preprended by /users

router.get('/:username', userController.get);

// use nested router for lists
router.use('/:username/lists', (req, res, next) => {
    req.username = req.params.username;
    next();
}, listRouter);

module.exports = router;
