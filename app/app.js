import express from 'express';
import { connectDB } from '../config/db/connection.js';

import authRouter from '../routes/auth.routes.js';
import userRouter from '../routes/user.routes.js';
import taskRouter from '../routes/task.routes.js';
import emailRouter from '../routes/email.routes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', taskRouter);
app.use('/api', emailRouter);

app.use((req, res, next) => {
    res.status(404).json({
        message: 'Endpoint losses',
    });
});

export default app;