
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import routes from './routes';

const app: Application = express();

// Middlewares
app.use(cors({
    origin: function (origin, callback) {
        callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}));
app.use(express.json());
app.use(morgan('dev'));

// Static files (for images)
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// Routes
app.use('/api', routes);
app.use('/', routes);

// Basic Route
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to Realtor Clone API' });
});

export default app;
