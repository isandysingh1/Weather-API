import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxLength: [30, 'Name must be less than 30 characters'],
        minLength: [3, 'Name must be more than 3 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please enter a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be at least 8 characters long']
    },
    role: {
        type: String,
        enum: ['Admin', 'Teacher', 'Student', 'Sensor'],
        default: 'Student',
        required: [true, 'Role is required']
    },
    lastLogin: {
        type: Date,
        default: Date.now,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: '30d',  }
    },
},
    { 
        timestamps: true,
    }
)

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  });

  // Generate a token for the user
  userSchema.methods.generateToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
  };
  
  // Method to compare hashed password for authentication
  userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };
  
  // Pre-save hook to set lastLogin on user login
  userSchema.methods.updateLastLogin = async function () {
    this.lastLogin = new Date();
    await this.save();
  };
  
  // Static method to remove inactive students (optional if TTL is not enabled)
  userSchema.statics.removeInactiveStudents = async function () {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30); // 30 days inactivity threshold
    return this.deleteMany({ role: 'Student', lastLogin: { $lte: cutoffDate } });
  };

  userSchema.index({ lastLogin: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });
  
  // Create and export the model
  const User = mongoose.model('User', userSchema);
  export default User;