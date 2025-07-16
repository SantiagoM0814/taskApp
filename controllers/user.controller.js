import UserModel from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();
class UserController {
    async addUser(req, res) {
        const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/;
        try {
            const { username, email, password } = req.body;
            if (!username || !email || !password) {
                return res.status(400).json({ error: 'All data is mandatory for entry' });
            }

            if (!passwordRegex.test(password)) {
                return res.status(400).json({ error: 'The password must be between 8 and 16 characters long, with at least one digit, at least one lowercase letter, at least one uppercase letter, and at least one non-alphanumeric character.' });
            }

            const existingUserModel = await UserModel.findOne({ email });
            if (existingUserModel) {
                return res.status(400).json({ error: 'The user already exists' });
            }

            const newUserModel = new UserModel({ username, email, password });
            await newUserModel.save();
            return res.status(201).json({ message: 'User successfully registered' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    async show(req, res) {
        try {
            const userModel = await UserModel.find();
            if (!userModel) throw new Error('User not found');
            return res.status(200).json({ data: userModel });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async findById(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ error: 'User Id is required' });
            }

            const userModel = await UserModel.findOne({ _id: id });
            if (!userModel) throw new Error('User not found');
            return res.status(200).json({ data: userModel });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    async update(req, res) {
        const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/;
        try {
            const { username, email, password } = req.body;
            if (!username || !email || !password) {
                return res.status(400).json({ error: 'All data is mandatory for entry' });
            }

            if (!passwordRegex.test(password)) {
                return res.status(400).json({ error: 'The password must be between 8 and 16 characters long, with at least one digit, at least one lowercase letter, at least one uppercase letter, and at least one non-alphanumeric character.' });
            }

            const existingUserModel = await UserModel.findOne({ email });
            if (!existingUserModel) {
                return res.status(400).json({ error: 'User not found' });
            }

            const updateUser = await UserModel.findOneAndUpdate(
                { _id: req.params.id },
                { username, password },
                { new: true }
            );

            if (!updateUser) {
                return res.status(404).json({ error: 'User not updated' });
            }
            res.status(200).json({ updateUser });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    async delete (req, res) {
        try {
            const deletedUser = await UserModel.findOneAndDelete({
                _id: req.params.id
            });
            if (!deletedUser) {
                return res.status(404).json({ error: 'User not deleted'});
            }
            res.status(200).json({ message: 'Deleted Successfully'});
        } catch (error) {
            res.status(500).json({ error: 'Error deleting user'});
        }
    };
}

export default new UserController();
