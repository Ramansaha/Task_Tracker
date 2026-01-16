import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Create mocks before importing
const mockApiResponse = {
  validationErrorWithData: jest.fn(),
  successResponseWithData: jest.fn(),
  errorResponse: jest.fn(),
};

const mockPostgresHelper = {
  create: jest.fn(),
  getManyPaginated: jest.fn(),
  getOne: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
};

const mockTaskModel = {};

// Mock all dependencies - use object with named exports
jest.unstable_mockModule('../../../helper/apiResponse.js', () => ({
  ...mockApiResponse
}));

jest.unstable_mockModule('../../../models/task/taskPostgres.js', () => ({ 
  default: mockTaskModel 
}));

jest.unstable_mockModule('../../../helper/postgres.js', () => ({
  create: jest.fn(),
  getMany: jest.fn(),
  getManyPaginated: jest.fn(),
  getOne: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
}));

// Import after mocking
const taskController = await import('../../../controllers/task/task.js');
const postgresHelper = await import('../../../helper/postgres.js');

// Get the mock functions from the imported module
const mockCreate = postgresHelper.create;
const mockGetManyPaginated = postgresHelper.getManyPaginated;
const mockGetOne = postgresHelper.getOne;
const mockUpdateOne = postgresHelper.updateOne;
const mockDeleteOne = postgresHelper.deleteOne;

describe('Task Controller', () => {
  let mockRequest, mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {
        auth: { userId: 'user123' }
      },
      params: {},
      query: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should return validation error when required fields are missing', async () => {
      mockRequest.body = { title: 'Test' };
      mockApiResponse.validationErrorWithData.mockReturnValue(mockResponse);

      await taskController.createTask(mockRequest, mockResponse);

      expect(mockApiResponse.validationErrorWithData).toHaveBeenCalledWith(
        mockResponse,
        'Title, start date and end date are required'
      );
    });

    it('should create task successfully', async () => {
      mockRequest.body = {
        title: 'Test Task',
        description: 'Test Description',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        auth: { userId: 'user123' }
      };
      const mockTask = { id: 'task123', ...mockRequest.body };
      mockCreate.mockResolvedValue({ status: true, data: mockTask });
      mockApiResponse.successResponseWithData.mockReturnValue(mockResponse);

      await taskController.createTask(mockRequest, mockResponse);

      expect(mockCreate).toHaveBeenCalled();
      expect(mockApiResponse.successResponseWithData).toHaveBeenCalledWith(
        mockResponse,
        'Task created successfully',
        mockTask
      );
    });

    it('should return error when task creation fails', async () => {
      mockRequest.body = {
        title: 'Test Task',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        auth: { userId: 'user123' }
      };
      mockCreate.mockResolvedValue({ status: false, message: 'Creation failed' });
      mockApiResponse.errorResponse.mockReturnValue(mockResponse);

      await taskController.createTask(mockRequest, mockResponse);

      expect(mockApiResponse.errorResponse).toHaveBeenCalledWith(
        mockResponse,
        'Creation failed'
      );
    });
  });

  describe('getTasks', () => {
    it('should return tasks with pagination', async () => {
      mockRequest.query = { page: '1', pageSize: '10' };
      mockRequest.auth = { userId: 'user123' };
      const mockTasks = [{ id: '1', title: 'Task 1' }];
      const mockPagination = {
        currentPage: 1,
        pageSize: 10,
        totalItems: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      };
      mockGetManyPaginated.mockResolvedValue({
        status: true,
        data: mockTasks,
        pagination: mockPagination
      });

      await taskController.getTasks(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith({
        tasks: mockTasks,
        pagination: mockPagination
      });
    });

    it('should filter by completed status', async () => {
      mockRequest.query = { page: '1', pageSize: '10', filter: 'completed' };
      mockRequest.auth = { userId: 'user123' };
      mockGetManyPaginated.mockResolvedValue({
        status: true,
        data: [],
        pagination: {}
      });

      await taskController.getTasks(mockRequest, mockResponse);

      expect(mockGetManyPaginated).toHaveBeenCalled();
    });

    it('should filter by pending status', async () => {
      mockRequest.query = { page: '1', pageSize: '10', filter: 'pending' };
      mockRequest.auth = { userId: 'user123' };
      mockGetManyPaginated.mockResolvedValue({
        status: true,
        data: [],
        pagination: {}
      });

      await taskController.getTasks(mockRequest, mockResponse);

      expect(mockGetManyPaginated).toHaveBeenCalled();
    });
  });

  describe('getTask', () => {
    it('should return validation error when task ID is missing', async () => {
      mockRequest.params = {};

      await taskController.getTask(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Task ID is required' });
    });

    it('should return task successfully', async () => {
      mockRequest.params = { id: 'task123' };
      mockRequest.auth = { userId: 'user123' };
      const mockTask = { id: 'task123', title: 'Test Task' };
      mockGetOne.mockResolvedValue({ status: true, data: mockTask });

      await taskController.getTask(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith(mockTask);
    });

    it('should return 404 when task not found', async () => {
      mockRequest.params = { id: 'task123' };
      mockRequest.auth = { userId: 'user123' };
      mockGetOne.mockResolvedValue({ status: false, message: 'Task not found' });

      await taskController.getTask(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
  });

  describe('updateTask', () => {
    it('should return validation error when task ID is missing', async () => {
      mockRequest.params = {};

      await taskController.updateTask(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Task ID is required' });
    });

    it('should update task successfully', async () => {
      mockRequest.params = { id: 'task123' };
      mockRequest.body = {
        title: 'Updated Task',
        completed: true,
        auth: { userId: 'user123' }
      };
      const mockUpdatedTask = { id: 'task123', ...mockRequest.body };
      mockUpdateOne.mockResolvedValue({ status: true, data: mockUpdatedTask });

      await taskController.updateTask(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedTask);
    });

    it('should return 404 when task not found', async () => {
      mockRequest.params = { id: 'task123' };
      mockRequest.body = { auth: { userId: 'user123' } };
      mockUpdateOne.mockResolvedValue({ status: false, message: 'Task not found' });

      await taskController.updateTask(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
  });

  describe('deleteTask', () => {
    it('should return validation error when task ID is missing', async () => {
      mockRequest.params = {};

      await taskController.deleteTask(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Task ID is required' });
    });

    it('should delete task successfully', async () => {
      mockRequest.params = { id: 'task123' };
      mockRequest.body = { auth: { userId: 'user123' } };
      mockDeleteOne.mockResolvedValue({ status: true });

      await taskController.deleteTask(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Task deleted' });
    });

    it('should return 404 when task not found', async () => {
      mockRequest.params = { id: 'task123' };
      mockRequest.body = { auth: { userId: 'user123' } };
      mockDeleteOne.mockResolvedValue({ status: false, message: 'Task not found' });

      await taskController.deleteTask(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
  });
});
