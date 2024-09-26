import express from 'express';
const router = express.Router();


import { createUser, loginUser, getUsers, getUserById, updateUserById, deleteUserById, deleteStudents, updateRole } from '../controllers/userController.js';


router.route('/register').post(createUser);
router.route('/login').post(loginUser);
router.route('/users').get(getUsers);
router.route('/users/:id').get(getUserById).put(updateUserById);
router.route('/users/deleteStudents').delete(deleteStudents);
router.route('/users/:id').delete(deleteUserById);
router.route('/users/updateRole').put(updateRole);
export default router;