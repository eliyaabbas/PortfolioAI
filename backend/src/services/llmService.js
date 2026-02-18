import axios from 'axios';
import env from '../config/env.js';

const TIMEOUT_MS = 90000; // 90s — Ollama cold start can take time to load model into VRAM

export async function getAIResponse(message, session_id = 'default') {
    if (!env.llmApiUrl) {
        const err = new Error('LLM_API_URL is not configured');
        err.status = 503;
        throw err;
    }

    try {
        const { data } = await axios.post(
            env.llmApiUrl,
            { message, session_id },
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: TIMEOUT_MS,
            }
        );

        return data.reply || data.response || data.text || JSON.stringify(data);
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            const err = new Error('LLM service timed out');
            err.status = 504;
            throw err;
        }

        if (error.response) {
            console.error('[LLM Service Error Response]', error.response.data);
            const err = new Error(
                `LLM service returned ${error.response.status}: ${error.response.data?.detail || JSON.stringify(error.response.data) || 'Unknown error'}`
            );
            err.status = 502;
            throw err;
        }

        const err = new Error('Unable to reach LLM service');
        err.status = 503;
        throw err;
    }
}
