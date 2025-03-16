import express from "express";
import dotenv from "dotenv";
import shitPostRouter from "./routers/shitPostRouter.mjs";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import logger from "./logger.mjs";
import morgan from "morgan";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`Blocked CORS request from origin: ${origin}`);
      callback(new Error("Not allowed by CORS, Don't try to play around with me"));
    }
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: false,
};
app.use(cors(corsOptions));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: "Too many requests, please try again after some time",
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded: ${req.ip}`);
    res.status(429).json({ message: "Too many requests, try again later." });
  },
});
app.use(limiter);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", "https://www.google.com/recaptcha/"],
      },
    },
  })
);
app.use(
  morgan("tiny", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url} from ${req.ip}`);
  next();
});
app.use("/api/shitpost", shitPostRouter);

app.all("*", (req, res, next) => {
  const errorMsg = `Can't find ${req.originalUrl} on the server`;
  logger.error(errorMsg);
  res.status(404).json({ message: errorMsg });
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
