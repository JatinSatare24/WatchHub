import express from 'express'
import { config } from 'dotenv'
import { connectDB, disconnectDB } from './config/db.js'

//import routes
import movieRoutes from './routes/movieRoutes.js'
import authRoutes from './routes/authRoutes.js'

config()
connectDB()

const app = express()



const PORT = 5001
const server = app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})

// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
    console.error("Uncaught Exception:", err);
    await disconnectDB();
    process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(async () => {
        await disconnectDB();
        process.exit(0);
    });
});