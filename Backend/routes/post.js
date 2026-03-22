import express from 'express';
import { Post } from '../models/post.models.js';

const router = express.Router();

// Naya post dalne ke liye
router.post('/add', async (req, res) => {
    try {
        const data = new Post(req.body);
        await data.save();
        res.status(201).send("Post Save Ho Gaya!");
    } catch (error) {
        res.status(500).json({ message: "Error saving post" });
    }
});

// Saare posts dekhne ke liye
router.get('/all', async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
});

export default router;