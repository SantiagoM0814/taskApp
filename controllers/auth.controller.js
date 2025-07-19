import UserModel from '../models/user.model.js';
import EmailController from '../controllers/email.controller.js';
import jwt from 'jsonwebtoken';
import { comparePassword } from '../library/appBcrypt.js';

import dotenv from 'dotenv';
dotenv.config();

class AuthController {
    async register(req, res) {
        try {
            const { username, email, password } = req.body;
            if (!username || !email || !password) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            if (password.length < 6) {
                return res.status(400).json({ error: 'The password must be at least 6 characters long' });
            }

            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'The user already exists' });
            }

            const newUser = new UserModel({ username, email, password });
            await newUser.save();
            await EmailController.sendWelcomeEmail(newUser);
            return res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message})
        }
    };

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const userModel = await UserModel.findOne({ email });
            if (!userModel) throw new Error('User not found');

            const isMatch = await comparePassword(password, userModel.password);
            if (!isMatch) throw new Error('Invalid password');

            const token = jwt.sign({ id: userModel._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });
            res.status(200).json({ message: 'Login successful', token: token });
        } catch (error) {
            res.status(400).json({ error: error.message});
        }
    };
}

export default new AuthController();
