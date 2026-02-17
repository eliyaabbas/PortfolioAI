import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chatRoutes.js';
import handleError from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api', chatRoutes);

app.use(handleError);

export default app;
