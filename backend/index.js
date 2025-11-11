import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import errorHandler from "./middleware/errorHandler.js";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

// app.use(cors());

app.use(
  cors({
    origin: ["http://localhost:3001", "http://127.0.0.1:3001"], // frontend
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboardcat",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, 
  })
);
app.use(passport.initialize());
app.use(passport.session());

// app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 100 });
app.use(limiter);
app.use("/api", routes);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
