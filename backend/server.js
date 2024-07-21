import path from "path";
import express from 'express';
import connectToMongodb from './db/connectToMongoDB.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Import cors middleware
import { createProxyMiddleware } from 'http-proxy-middleware'; // Import proxy middleware

import profileRoutes from "./routes/profile.routes.js";
import authRoutes from "./routes/auth.routes.js";
import getProfile from "./routes/getProfile.routes.js";
import getAllUsers from "./routes/getAllUsers.routes.js";

dotenv.config();
const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies to be sent and received
}));

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

// Define the target server for the proxy
const targetServer = 'http://example.com'; // Replace with your target server

// Create and apply proxy middleware
app.use('/api/proxy', createProxyMiddleware({
  target: targetServer,
  changeOrigin: true, // Changes the origin of the host header to the target URL
  pathRewrite: (path, req) => path.replace('/api/proxy', ''), // Optional: rewrites the URL path
}));

app.use("/api/auth", authRoutes);
app.use("/api/updateProfile", profileRoutes);
app.use("/api/getProfile", getProfile);
app.use("/api/users", getAllUsers);

app.use(express.static(path.join(__dirname, "/frontend/build")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

// Connect to MongoDB and start the server
app.listen(PORT, () => {
  connectToMongodb();
  console.log(`Server is running on http://localhost:${PORT}`);
});
