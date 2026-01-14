import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import routes from './routes/apiRoutes.js';
import connectDB from './config/conn.js';
import { connectPostgres } from './config/postgresConn.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootEnvPath = join(__dirname, '../.env');
const backendEnvPath = join(__dirname, '.env');

if (existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config({ path: backendEnvPath });
}

connectDB();
connectPostgres();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/taskTrac', routes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`----------------------------- Task_tracker is running on port : ${PORT} ----------------------------------`);
});