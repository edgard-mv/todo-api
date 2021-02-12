const router = require('express').Router();
const taskController = require('../controllers/taskController');

// every route is preprended by /users/:username/lists/:listId/tasks

router.post('/', taskController.addToList);
router.delete('/:taskId', taskController.removeFromList);
router.patch('/:taskId', taskController.changeDoneStatus);

module.exports = router
