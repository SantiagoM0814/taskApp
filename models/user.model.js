import { mongoose } from '../config/db/connection.js';
import { encryptPassword } from '../library/appBcrypt.js';

const userChema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

userChema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        this.password = await encryptPassword(this.password);
        next();
    } catch (error) {
        next(error);
    }
});

export default mongoose.model('User', userChema);
