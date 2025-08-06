import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/apiRoutes.js'
import connectDB from './config/conn.js';

dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/taskTrac', routes);

const PORT = process.env.PORT || 8000
app.listen(PORT , ()=> {
    console.log(`----------------------------- Task_tracker is running on port : ${PORT} ----------------------------------`)
})