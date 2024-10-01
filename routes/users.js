import express from 'express';
const router = express.Router();


import { createUser, loginUser, getUsers, getUserById, updateUserById, deleteUserById, deleteStudents, updateRole, logoutUser } from '../controllers/userController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/auth.js';


router.route('/register').post(isAuthenticated, authorizeRoles('admin'), createUser);
router.route('/login').post(loginUser);
router.route('/users').get(isAuthenticated, authorizeRoles('admin', 'teacher'), getUsers);
router.route('/users/:id').get(isAuthenticated, authorizeRoles('admin', 'teacher'), getUserById).put(isAuthenticated, authorizeRoles('admin', 'teacher'), updateUserById);
router.route('/users/deleteStudents').delete(isAuthenticated, authorizeRoles('admin', 'teacher'), deleteStudents);
router.route('/users/:id').delete(isAuthenticated, authorizeRoles('admin', 'teacher'), deleteUserById);
router.route('/users/updateRole').put(isAuthenticated, authorizeRoles('admin', 'teacher'), updateRole);
router.route('/logout').get(logoutUser);

export default router;