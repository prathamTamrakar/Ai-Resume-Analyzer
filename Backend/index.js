import dotenv from "dotenv";

dotenv.config();
import express from 'express';
import cors from 'cors';

import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;
// Database
connectDB().then(() => console.log('MongoDB connected')).catch(err => console.log(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

// Server


app.listen(PORT, () => console.log(`Server running on port ${PORT} ✅`));
