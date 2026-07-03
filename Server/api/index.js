import { configDotenv } from 'dotenv';
configDotenv();

const PORT = process.env.PORT || 5000;

let app;
try {
    app = (await import('../src/app.js')).default;
} catch (err) {
    console.error("FATAL IMPORT ERROR:", err);
    throw err;
}

// app.listen(PORT, () => {
//     console.log(`Server is listening at PORT ${PORT}`);
// })

export default app;