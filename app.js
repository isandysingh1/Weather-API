import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import errorMiddleware from './middleware/errors.js';

dotenv.config({ path: './config/config.env' });

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// import routes
// import usersRoutes from './routes/users.js';
import weatherRoutes from './routes/weather.js';

// Routes
// app.use('/api/users', usersRoutes);
app.use('/api', weatherRoutes);

// Error Middleware
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
