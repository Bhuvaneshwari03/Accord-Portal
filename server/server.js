import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';

// Load env variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Allows requests from your client
app.use(express.json()); // Allows server to accept JSON data in body

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leave', leaveRoutes);

// Simple root route
app.get('/', (req, res) => {
  res.send('Student Leave Portal API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});