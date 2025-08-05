import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', (req, res) => {
    res.json({message : `I am heavy`})
});

const PORT = process.env.PORT || 8000

app.listen(PORT , ()=> {
    console.log(`----------------------------- Task_tracker is running on port : ${PORT} ----------------------------------`)
})