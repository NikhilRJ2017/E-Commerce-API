const express = require('express');
const { authenticateUser, authorizePermissions } = require('../config/middlewares/authMiddleware');
const { getAllUsers, getSingleUser, getCurrentUser, updateUser, updateUserPassword } = require('../controllers/userController');
const router = express.Router();

//? authorizePermission refactored to allow any new roles been added in future such as owner
router.route('/').get(authenticateUser, authorizePermissions('admin', 'owner'), getAllUsers);
router.route('/current_user').get(authenticateUser, getCurrentUser);
router.route('/update_user').patch(authenticateUser, updateUser);
router.route('/update_user_password').patch(authenticateUser, updateUserPassword);
router.route('/:id').get(authenticateUser, getSingleUser)

module.exports = router;