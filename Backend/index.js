import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";

dotenv.config(); // ✅ correct absolute path
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Database
connectDB().then(() => console.log('MongoDB connected ✅')).catch(err => console.log(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

// Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} ✅`));
