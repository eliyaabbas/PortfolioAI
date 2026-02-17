import dotenv from 'dotenv';

dotenv.config();

const env = {
    port: parseInt(process.env.PORT, 10) || 5000,
    llmApiUrl: process.env.LLM_API_URL || '',
    nodeEnv: process.env.NODE_ENV || 'development',
};

export default env;
