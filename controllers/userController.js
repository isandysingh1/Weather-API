import User from '../models/userModel.js';
import ErrorHandler from '../utils/errorHandler.js';
import { sendToken } from '../utils/sendToken.js';
import bcrypt from 'bcrypt';

// Create a new user => /api/register
export const createUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            role
        });

        sendToken(user, 201, res);

        } catch (error) {
        next(error);
    }

}

// Login user => /api/login
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorHandler('Please provide an email and password', 400));
        }

        // find user by email
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(new ErrorHandler('Invalid email or password', 401));
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return next(new ErrorHandler('Invalid email or password', 401));
        }

        sendToken(user, 200, res);

        await user.updateLastLogin();

    } catch (error) {
        next(error);
    }
}

// Get all users => /api/users
export const getUsers = async (req,res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        return next( new ErrorHandler(error.message, 500));
    }
}

// Get user by id => /api/users/:id
export const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}

// Update user by id => /api/users/:id
export const updateUserById = async (req, res, next) => {
    try {
        const updates = req.body;

          // Check if the password is being updated
          if (updates.password) {
            // Hash the password before updating
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }
        const user = await User.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true
        });

        if(!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user
        });
        
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}

// Delete user by id => /api/users/:id
export const deleteUserById = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if(!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}

// Delete multiple users => /api/users/deleteStudents
export const deleteStudents = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.body;

        if(!startDate || !endDate) {
            return next(new ErrorHandler('Please provide a start and end date', 400));
        }

        const users = await User.deleteMany({ 
            role: 'Student', 
            lastLogin: { 
                $gte: new Date(startDate), 
                $lte: new Date(endDate) 
            } 
        });

        res.status(200).json({
            success: true,
            message: `${users.deletedCount} students deleted successfully`
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}

// Update user role => /api/users/updateRole
export const updateRole = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.body;

        if(!startDate || !endDate) {
            return next(new ErrorHandler('Please provide a start and end date', 400));
        }

        const users = await User.updateMany(
            { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } },
            { $set: { role: 'Teacher' } }
        );

        res.status(200).json({
            success: true,
            message: `${users.modifiedCount} users updated successfully`
        });
        
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}

// Logout user => /api/logout
export const logoutUser = async (req, res, next) => {
    try {
        res.clearCookie('token');
        res.status(200).json({
            success: true,
            message: 'User logged out successfully'
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}