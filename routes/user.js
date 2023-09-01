const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/auth');
const userController = require('../controllers/UserController');

router.get('/users', authorize(['admin', 'member']), userController.getUsers);
router.delete('/user/:id', authorize(['admin']), userController.deleteUser);
router.put('/user/:id', authorize(['admin']), userController.updateUser);

module.exports = router;