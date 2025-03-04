import express from 'express';
import dotenv from 'dotenv';
import shitPostRouter from './routers/shitPostRouter.mjs';

const app = express();
dotenv.config();
import cors from 'cors';


const PORT = process.env.PORT || 8080;
app.use(cors("*"));
app.use(express.json());
app.use('/api/shitpost', shitPostRouter);

app.all('*', (req, res, next) => {
    next(console.log(`Can't find ${req.originalUrl} on the server`, 404));
});


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})