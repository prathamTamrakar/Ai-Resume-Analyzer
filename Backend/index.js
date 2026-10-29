import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const PORT = process.env.PORT || 5000;
// Database
connectDB().then(() => console.log('MongoDB connected')).catch(err => console.log(err));

// Routes
app.use('/api/health', healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

// Server


app.listen(PORT, () => console.log(`Server running on port ${PORT} ✅`));
