const router = require('express').Router();
const listController = require('../controllers/listController');
const taskRouter = require('./tasks');

// every route is preprended by /users/:username/lists

router.get('/', listController.getByUsername);
router.post('/', listController.create);
router.delete('/:listId', listController.removeByUsername);


router.use('/:listId/tasks', (req, res, next) => {
    req.listId = req.params.listId;
    next();
}, taskRouter);

module.exports = router;
