import Task from "../../models/task/task.js";
import { create , getOne} from '../../helper/mongo.js';
import * as apiResponse from '../../helper/apiResponse.js';

// Create task
export const createTask = async (request, response) => {
    try {
        const { title, dueDate , auth} = request.body;
        if(!title || !dueDate) {
            return apiResponse.validationErrorWithData(response, "Title and due date are required");
        }   
        const newTask = await Task.create({
            title,
            dueDate,
            userId: auth.userId// from JWT middleware
        });
        return apiResponse.successResponseWithData(response, "Task created successfully", newTask);
    } catch (err) {
        return apiResponse.errorResponse(response, "Failed to create task");
    }
};

// Get all tasks for logged-in user
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.auth.userId });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch tasks" });
    }
};

// Get single task
export const getTask = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Task ID is required" });
        }
        const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch task" });
    }
};

// Update task
export const updateTask = async (req, res) => {
    try {
        if (!req.params.id || req.body.completed === undefined) {
            return res.status(400).json({ message: "Task ID and task status are required" });
        }   
        const updated = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.body.auth.userId },
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Task not found" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Failed to update task" });
    }
};

// Delete task
export const deleteTask = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Task ID is required" });
        }
        const deleted = await Task.findOneAndDelete({ _id: req.params.id, userId: req.body.auth.userId });
        if (!deleted) return res.status(404).json({ message: "Task not found" });
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete task" });
    }
};
