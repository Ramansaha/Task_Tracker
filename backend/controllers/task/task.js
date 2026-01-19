import Task from "../../models/task/taskPostgres.js";
import * as apiResponse from '../../helper/apiResponse.js';
import { create, getOne, getManyPaginated, updateOne, deleteOne } from '../../helper/postgres.js';
import { Op } from 'sequelize';

export const createTask = async (request, response) => {
  try {
    const { title, description, startDate, endDate } = request.body;

    if (!title || !startDate || !endDate) {
      return apiResponse.validationErrorWithData(
        response,
        "Title, start date and end date are required"
      );
    }

    const taskData = {
      title,
      description: description || "",
      startDate,
      endDate,
      userId: request.body?.auth?.userId?.toString(),
    };

    const result = await create(Task, taskData);

    if (!result.status) {
      return apiResponse.errorResponse(response, result.message || "Failed to create task");
    }

    return apiResponse.successResponseWithData(
      response,
      "Task created successfully",
      result.data
    );
  } catch (err) {
    console.error('Create task error:', err);
    return apiResponse.errorResponse(response, "Failed to create task");
  }
};

export const getTasks = async (req, res) => {
    try {
        const userId = req.auth.userId.toString();
        const where = { userId };

        // Add filter for completed status if provided
        const filter = req.query.filter;
        if (filter === 'completed') {
            where.completed = true;
        } else if (filter === 'pending') {
            where.completed = false;
        }
        // If filter is 'all' or not provided, show all tasks (no additional where condition)

        const startDateParam = req.query.startDate;
        const endDateParam = req.query.endDate;
        const dateMode = req.query.dateMode;

        if (dateMode === 'all') {
        } else if ((!startDateParam || startDateParam.trim() === '') && (!endDateParam || endDateParam.trim() === '')) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            where.startDate = {
                [Op.gte]: today
            };
        } else {
            if (startDateParam && startDateParam.trim() !== '' && endDateParam && endDateParam.trim() !== '') {
                const startDate = new Date(startDateParam);
                startDate.setHours(0, 0, 0, 0);
                const endDate = new Date(endDateParam);
                endDate.setHours(23, 59, 59, 999);

                if (startDate > endDate) {
                    return res.status(400).json({ 
                        message: "Start date must be less than or equal to end date" 
                    });
                }

                where.startDate = {
                    [Op.between]: [startDate, endDate]
                };
            } else if (startDateParam && startDateParam.trim() !== '') {
                const startDate = new Date(startDateParam);
                startDate.setHours(0, 0, 0, 0);
                where.startDate = {
                    [Op.gte]: startDate
                };
            } else if (endDateParam && endDateParam.trim() !== '') {
                const endDate = new Date(endDateParam);
                endDate.setHours(23, 59, 59, 999);
                where.startDate = {
                    [Op.lte]: endDate
                };
            }
        }

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const sortBy = req.query.sortBy || 'startDate';
        const sortOrder = req.query.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const result = await getManyPaginated(Task, where, {
            page,
            pageSize,
            order: [[sortBy, sortOrder]]
        });

        if (!result.status) {
            console.error('Pagination failed:', result.error || result.message);
            return res.status(404).json({ message: result.message || "No tasks found" });
        }

        if (!result.pagination) {
            console.error('Pagination object missing in result');
            return res.status(500).json({ message: "Pagination data missing" });
        }

        return res.json({
            tasks: result.data,
            pagination: result.pagination
        });
    } catch (err) {
        console.error('Get tasks error:', err);
        return res.status(500).json({ message: "Failed to fetch tasks" });
    }
};

export const getTask = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Task ID is required" });
        }
        
        const where = {
            id: req.params.id,
            userId: req.auth.userId.toString()
        };
        
        const result = await getOne(Task, where);
        
        if (!result.status) {
            return res.status(404).json({ message: result.message || "Task not found" });
        }
        
        return res.json(result.data);
    } catch (err) {
        console.error('Get task error:', err);
        return res.status(500).json({ message: "Failed to fetch task" });
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
        if (req.body.endDate !== undefined) {
            updateData.endDate = req.body.endDate;
        }
        
        const where = {
            id: req.params.id,
            userId: req.body.auth.userId.toString()
        };
        
        const result = await updateOne(Task, where, updateData);
        
        if (!result.status) {
            return res.status(404).json({ message: result.message || "Task not found" });
        }
        
        return res.json(result.data);
    } catch (err) {
        console.error('Update task error:', err);
        return res.status(500).json({ message: "Failed to update task" });
    }
};

export const deleteTask = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Task ID is required" });
        }
        
        const where = {
            id: req.params.id,
            userId: req.body.auth.userId.toString()
        };
        
        const result = await deleteOne(Task, where);
        
        if (!result.status) {
            return res.status(404).json({ message: result.message || "Task not found" });
        }
        
        return res.json({ message: "Task deleted" });
    } catch (err) {
        console.error('Delete task error:', err);
        return res.status(500).json({ message: "Failed to delete task" });
    }
};
