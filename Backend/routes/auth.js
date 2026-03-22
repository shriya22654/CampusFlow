import express from 'express';
import jwt from 'jsonwebtoken'; // Sabse upar import
import { User } from '../models/user.models.js';

const router = express.Router();

//REGISTER ROUTE
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(400).json({ message: 'Already Registered' });
        }
        
        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: 'Registered!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'There is some error in the server' });
    }
});

//LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check user existence
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Email or Password' });
        }

        // 2. Password match (Bcrypt method from model)
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Email or Password' });
        }

        // 3. Generate JWT Token
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } // 1 din ke liye rakhte hain taaki baar-baar login na karna pade
        );

        // 4. Final Success Response (Sirf Ek Baar)
        res.status(200).json({ 
            message: 'Login Successful!',
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email 
            } 
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;