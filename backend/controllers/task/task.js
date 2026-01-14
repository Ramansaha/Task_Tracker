import Task from "../../models/task/taskPostgres.js";
import * as apiResponse from '../../helper/apiResponse.js';

export const createTask = async (request, response) => {
  try {
    const { title, description, startDate, endDate } = request.body;

    if (!title || !startDate || !endDate) {
      return apiResponse.validationErrorWithData(
        response,
        "Title, start date and end date are required"
      );
    }

    const newTask = await Task.create({
      title,
      description: description || "",
      startDate,
      endDate,
      userId: request.body?.auth?.userId?.toString(),
    });

    return apiResponse.successResponseWithData(
      response,
      "Task created successfully",
      newTask
    );
  } catch (err) {
    console.error('Create task error:', err);
    return apiResponse.errorResponse(response, "Failed to create task");
  }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({ 
          where: { userId: req.auth.userId.toString() },
          order: [['createdAt', 'DESC']]
        });
        res.json(tasks);
    } catch (err) {
        console.error('Get tasks error:', err);
        res.status(500).json({ message: "Failed to fetch tasks" });
    }
};

export const getTask = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Task ID is required" });
        }
        const task = await Task.findOne({ 
          where: { 
            id: req.params.id, 
            userId: req.auth.userId.toString() 
          } 
        });
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json(task);
    } catch (err) {
        console.error('Get task error:', err);
        res.status(500).json({ message: "Failed to fetch task" });
    }
};

export const updateTask = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Task ID is required" });
        }
        
        const updateData = {};
        if (req.body.completed !== undefined) {
            updateData.completed = req.body.completed;
        }
        if (req.body.title !== undefined) {
            updateData.title = req.body.title;
        }
        if (req.body.description !== undefined) {
            updateData.description = req.body.description;
        }
        if (req.body.startDate !== undefined) {
            updateData.startDate = req.body.startDate;
        }
        if (req.body.endDate !== undefined) {
            updateData.endDate = req.body.endDate;
        }
        
        const [updatedCount] = await Task.update(
            updateData,
            { 
              where: { 
                id: req.params.id, 
                userId: req.body.auth.userId.toString() 
              } 
            }
        );
        if (updatedCount === 0) return res.status(404).json({ message: "Task not found" });
        
        const updated = await Task.findByPk(req.params.id);
        res.json(updated);
    } catch (err) {
        console.error('Update task error:', err);
        res.status(500).json({ message: "Failed to update task" });
    }
};

export const deleteTask = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Task ID is required" });
        }
        const deletedCount = await Task.destroy({ 
          where: { 
            id: req.params.id, 
            userId: req.body.auth.userId.toString() 
          } 
        });
        if (deletedCount === 0) return res.status(404).json({ message: "Task not found" });
        res.json({ message: "Task deleted" });
    } catch (err) {
        console.error('Delete task error:', err);
        res.status(500).json({ message: "Failed to delete task" });
    }
};
