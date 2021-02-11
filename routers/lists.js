const router = require('express').Router();
const listController = require('../controllers/listController');

router.get('/', listController.getByUsername);

router.post('/', listController.create);

router.post('/:listId/tasks', listController.addTask);

module.exports = router;
