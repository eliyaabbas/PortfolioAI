import { getAIResponse } from '../services/llmService.js';

export async function handleChat(req, res, next) {
    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string' || !message.trim()) {
            const err = new Error('A non-empty "message" string is required');
            err.status = 400;
            throw err;
        }

        const reply = await getAIResponse(message.trim());

        res.json({ success: true, reply });
    } catch (error) {
        next(error);
    }
}
