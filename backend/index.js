import 'dotenv/config'
import { app, server } from './socket.js'
import { sequelize } from "./models/index.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import userRouter from "./routes/userRoutes.js";
import itemRouter from "./routes/itemRoutes.js";
import messageRouter from './routes/messageRoutes.js';

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  const cleanOrigin = origin.replace(/\/$/, "");
  if (cleanOrigin.includes("localhost") || cleanOrigin.includes("127.0.0.1")) return true;
  if (cleanOrigin.endsWith(".vercel.app")) return true;
  if (process.env.CLIENT_URL && cleanOrigin === process.env.CLIENT_URL.replace(/\/$/, "")) return true;
  return false;
};

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

// Serve uploaded files from /public so local-file fallback images work
app.use('/public', express.static(path.join(process.cwd(), 'public')));

app.use(cors({
    origin: function (origin, callback) {
        if (isAllowedOrigin(origin)) {
            callback(null, true);
        } else {
            console.warn(`[CORS Blocked] Origin not allowed: ${origin}`);
            callback(null, false);
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.get("/",(req,res)=>{
    res.send("server is running... ")
})

const PORT = process.env.PORT || 8000;

import adminRouter from "./routes/adminRoutes.js";

app.use("/api/user", userRouter);
app.use("/api/item", itemRouter);
app.use("/api/message", messageRouter);
app.use("/api/admin", adminRouter);

server.listen(PORT , ()=>{
    sequelize.authenticate()
  .then(() => console.log("MySQL Connected"))
  .catch(err => console.log(err));
// In development, sync with alter:false to avoid duplicate key errors on old tables
const syncOptions = process.env.NODE_ENV === 'production' ? {} : {};
sequelize.sync(syncOptions)
  .then(() => console.log("MySQL synced"))
  .catch(err => console.log(err));
  console.log(`Server listening on port ${PORT}`)
})
