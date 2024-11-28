import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import errorMiddleware from './middleware/errors.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config({ path: './config/config.env' });

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

// cors config
const corsOptions = {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// import routes
import usersRoutes from './routes/users.js';
import weatherRoutes from './routes/weather.js';

// Routes
app.use('/api', usersRoutes);
app.use('/api', weatherRoutes);


// Error Middleware
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
