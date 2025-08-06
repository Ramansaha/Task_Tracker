import express from 'express';
import * as auth from '../../controllers/auth/auth.js';
import * as apiResponse from '../../helper/apiResponse.js';
import * as task from '../../controllers/task/task.js';
// import user from './user/user.js';
const router = express.Router();

router.post("/add", 
    auth.isAuth,
    task.createTask
);

router.get("/list", auth.isAuth, task.getTasks);
router.get("/list/:id", auth.isAuth, task.getTask);
router.put("/upadte/:id", auth.isAuth,task.updateTask);
router.delete("/delete/:id", auth.isAuth, task.deleteTask);

export default router;