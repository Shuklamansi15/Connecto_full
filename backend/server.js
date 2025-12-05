import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import adminRouter from "./routes/adminRoute.js";
import InfluencerRouter from "./routes/InfluencerRoute.js";

// app config
const app = express();
const port = process.env.PORT || 4000;

// connect to DB + Cloudinary
connectDB();
connectCloudinary();

// middleware
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
"http://localhost:5173",                    // Local frontend
  "http://localhost:5174",                    // Local admin
  "https://connecto-full.vercel.app",         // Vercel frontend
  "https://connecto-full-ksjc.vercel.app" // admin panel
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "token",
    "aToken" ,
    "itoken",
  ],
  credentials: true,
}));

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/influencer", InfluencerRouter);

// Test route
app.get("/", (req, res) => {
  res.send("API Working");
});

// Start server
app.listen(port, () => console.log(`✅ Server started on PORT: ${port}`));
