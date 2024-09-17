import express from 'express';
const router = express.Router();


// import { registerUser, loginUser, getUserProfile } from '../controllers/userController.js';

// const router = express.Router();

router.route('/register').post(registerUser);
// router.post('/login', loginUser);
// router.get('/profile', getUserProfile);

export default router;