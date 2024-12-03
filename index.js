import express from 'express';
import passport from "passport";
import http from 'http';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import session from 'express-session';
import { config as configDotenv } from 'dotenv';
import authRoutes from './src/routes/authRouter.js';
import userRoutes from './src/routes/user.routes.js';
import globalRoutes from './src/routes/globalRoutes.js';
import { sequelizeConnection } from './src/database/connection.js';
import { connectAndSyncModels } from './src/database/modalSync.js';
import googleLogin from "./src/config/googleConfig.js"

configDotenv();

const app = express()
const server = http.createServer(app);


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "dfmkcESIJFOPEWJFJEW,v;,",
    resave: false,
    saveUninitialized: false,
  }));

//facebook middleware for app use
app.use(passport.initialize());
googleLogin(passport);


//api routes 
app.use("/auth", authRoutes);
app.use("/api/user/", userRoutes);
app.use("/api/data/", globalRoutes);

const PORT = process.env.PORT || 3630;

console.log("port from index" , PORT)
// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
