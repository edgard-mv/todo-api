const router = require('express').Router();
const authController = require('../controllers/authController');


router.post('/login', authController.login);
router.delete('/logout', authController.logout);
router.post('/token', authController.getToken);
router.post('/signup', authController.signup);

module.exports = router;
