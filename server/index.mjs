import express from 'express';
import dotenv from 'dotenv';
import shitPostRouter from './routers/shitPostRouter.mjs';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const app = express();
dotenv.config();
import cors from 'cors';
const PORT = process.env.PORT || 8080;

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS, Dont try to play around with me"));
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
  max: 300,
  message: "Too many requests, please try again after some time",
});

app.use(limiter);  

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", "https://www.google.com/recaptcha/"],
      },
    },
  }),
);
app.use('/api/shitpost', shitPostRouter);

app.all('*', (req, res, next) => {
    next(console.log(`Can't find ${req.originalUrl} on the server`, 404));
});


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})