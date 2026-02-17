import env from '../config/env.js';

const handleError = (err, _req, res, _next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal server error';

    if (env.nodeEnv === 'development') {
        console.error(`[Error] ${status} — ${message}`);
        if (err.stack) console.error(err.stack);
    }

    res.status(status).json({
        success: false,
        error: message,
    });
};

export default handleError;
