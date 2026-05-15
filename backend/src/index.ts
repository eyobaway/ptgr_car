import app from './app';
import { connectDB } from './config/database';
import { createServer } from 'http';
import { initSocket } from './socket';

const httpServer = createServer(app);
initSocket(httpServer);

// Connect to Database
connectDB().catch(err => {
    console.error('Initial DB connection failed:', err);
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;
