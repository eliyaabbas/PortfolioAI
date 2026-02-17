import axios from 'axios';
import env from '../config/env.js';

const TIMEOUT_MS = 30000;

export async function getAIResponse(message) {
    if (!env.llmApiUrl) {
        const err = new Error('LLM_API_URL is not configured');
        err.status = 503;
        throw err;
    }

    try {
        const { data } = await axios.post(
            env.llmApiUrl,
            { message },
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
            const err = new Error(
                `LLM service returned ${error.response.status}: ${error.response.data?.detail || 'Unknown error'}`
            );
            err.status = 502;
            throw err;
        }

        const err = new Error('Unable to reach LLM service');
        err.status = 503;
        throw err;
    }
}
