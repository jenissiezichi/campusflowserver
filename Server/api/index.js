import { configDotenv } from 'dotenv';
configDotenv();

let app;
try {
    app = (await import('../src/app.js')).default;
} catch (err) {
    console.error("FATAL IMPORT ERROR:", err);
    throw err;
}

export default app;