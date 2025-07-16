import express from 'express';
import { connectDB } from '../config/db/connection.js';

import authRouter from '../routes/auth.routes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api', authRouter);

app.use((req, res, next) => {
    res.status(404).json({
        message: 'Endpoint losses',
    });
});

export default app;