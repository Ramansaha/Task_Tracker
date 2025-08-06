import express from 'express';
import auth from './auth/auth.js';
// // import user from './user/user.js';   
// // import task from './task/task.js';
const app  = express();

app.use('/auth', auth);
// app.use('/user', user);
// app.use('/task', task);

export default app;