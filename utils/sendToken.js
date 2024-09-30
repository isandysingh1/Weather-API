import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// create and send token and save in the cookie
export const sendToken = (user, statusCode, res) => {
    // create jwt token
    const token = user.generateToken();

    // check if COOKIE_EXPIRE is defined and is a valid number
    const cookieExpire = process.env.COOKIE_EXPIRE ? parseInt(process.env.COOKIE_EXPIRE, 10) : 1; // default to 1 hour if not defined

    // options for cookie
    const options = {
        expires: new Date(Date.now() + cookieExpire * 60 * 60 * 1000),
        httpOnly: true
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        user,
        token
    });
}