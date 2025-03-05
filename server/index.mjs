import express from 'express';
import dotenv from 'dotenv';
import shitPostRouter from './routers/shitPostRouter.mjs';

const app = express();
dotenv.config();
import cors from 'cors';
const PORT = process.env.PORT || 8080;

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
console.log(allowedOrigins);
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS, Dont try to play around with me"));
    }
  },
  methods: ["GET", "POST"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type"], // Allowed headers
  credentials: false,

};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/shitpost', shitPostRouter);

app.all('*', (req, res, next) => {
    next(console.log(`Can't find ${req.originalUrl} on the server`, 404));
});


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})