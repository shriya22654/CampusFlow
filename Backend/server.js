import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/post.js';

const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("✅ MongoDB Connected..."))
    .catch(err => console.log("❌ DB Error:", err));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 1485;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
