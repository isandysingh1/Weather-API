import express from 'express';
const router = express.Router();

import { createUser, loginUser, getUsers, getUserById, updateUserById, deleteUserById, deleteStudents, updateRole, logoutUser } from '../controllers/userController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/auth.js';


router.route('/register').post(createUser);

router.route('/login').post(loginUser);


router.route('/logout').get(logoutUser);

router.route('/users').get(isAuthenticated, authorizeRoles('Admin', 'Teacher'), getUsers);

router.route('/users/updateRole').put(isAuthenticated, authorizeRoles('Admin', 'Teacher'), updateRole);

router.route('/users/:id').get(isAuthenticated, authorizeRoles('Admin', 'Teacher'), getUserById);

router.route('/users/:id').put(isAuthenticated, authorizeRoles('Admin', 'Teacher'), updateUserById);


router.route('/users/deleteStudents').delete(isAuthenticated, authorizeRoles('Admin', 'Teacher'), deleteStudents);


router.route('/users/:id').delete(isAuthenticated, authorizeRoles('Admin', 'Teacher'), deleteUserById);


export default router;
