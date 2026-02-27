import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/userRoutes.js";
import noteRoutes from "./src/routes/noteRoutes.js";

dotenv.config();

const app = express();
connectDB();

app.use(express.json());

app.use(
  cors({
    origin: "https://mern-notemaker.netlify.app",

    credentials: true
  })
);
app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI
    }),
    cookie: {
      httpOnly: true,
      secure: true,   // MUST be false on localhost
      sameSite: "none"
    }
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);