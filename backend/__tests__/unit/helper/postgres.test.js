import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock the Task model before importing
const mockTaskModel = {
  create: jest.fn(),
  bulkCreate: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
  count: jest.fn(),
};

jest.unstable_mockModule('../../../models/task/taskPostgres.js', () => ({
  default: mockTaskModel
}));

// Now import after mocking
const postgresHelper = await import('../../../helper/postgres.js');

describe('PostgreSQL Helper Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new record successfully', async () => {
      const mockData = { title: 'Test Task', userId: '123' };
      const mockResult = { id: 'uuid-123', ...mockData };
      
      mockTaskModel.create.mockResolvedValue(mockResult);

      const result = await postgresHelper.create(mockTaskModel, mockData);

      expect(result.status).toBe(true);
      expect(result.data).toEqual(mockResult);
      expect(mockTaskModel.create).toHaveBeenCalledWith(mockData);
    });

    it('should return error when creation fails', async () => {
      mockTaskModel.create.mockResolvedValue(null);

      const result = await postgresHelper.create(mockTaskModel, {});

      expect(result.status).toBe(false);
      expect(result.message).toBe('Data not created');
    });
  });

  describe('getOne', () => {
    it('should find one record successfully', async () => {
      const mockWhere = { id: 'uuid-123' };
      const mockResult = { id: 'uuid-123', title: 'Test Task' };
      
      mockTaskModel.findOne.mockResolvedValue(mockResult);

      const result = await postgresHelper.getOne(mockTaskModel, mockWhere);

      expect(result.status).toBe(true);
      expect(result.data).toEqual(mockResult);
      expect(mockTaskModel.findOne).toHaveBeenCalledWith({ where: mockWhere });
    });

    it('should return error when record not found', async () => {
      mockTaskModel.findOne.mockResolvedValue(null);

      const result = await postgresHelper.getOne(mockTaskModel, {});

      expect(result.status).toBe(false);
      expect(result.message).toBe('No data found');
    });
  });

  describe('getMany', () => {
    it('should find multiple records successfully', async () => {
      const mockResults = [
        { id: '1', title: 'Task 1' },
        { id: '2', title: 'Task 2' }
      ];
      
      mockTaskModel.findAll.mockResolvedValue(mockResults);

      const result = await postgresHelper.getMany(mockTaskModel, {});

      expect(result.status).toBe(true);
      expect(result.data).toEqual(mockResults);
    });

    it('should return error when no records found', async () => {
      mockTaskModel.findAll.mockResolvedValue([]);

      const result = await postgresHelper.getMany(mockTaskModel, {});

      expect(result.status).toBe(false);
      expect(result.message).toBe('No data found');
    });
  });

  describe('updateOne', () => {
    it('should update a record successfully', async () => {
      const mockWhere = { id: 'uuid-123' };
      const mockUpdateData = { title: 'Updated Task' };
      const mockUpdated = { id: 'uuid-123', ...mockUpdateData };
      
      mockTaskModel.update.mockResolvedValue([1]); // [updatedCount]
      mockTaskModel.findOne.mockResolvedValue(mockUpdated);

      const result = await postgresHelper.updateOne(mockTaskModel, mockWhere, mockUpdateData);

      expect(result.status).toBe(true);
      expect(result.data).toEqual(mockUpdated);
      expect(mockTaskModel.update).toHaveBeenCalledWith(mockUpdateData, { where: mockWhere });
    });

    it('should return error when no records updated', async () => {
      mockTaskModel.update.mockResolvedValue([0]);

      const result = await postgresHelper.updateOne(mockTaskModel, {}, {});

      expect(result.status).toBe(false);
      expect(result.message).toBe('No data updated');
    });
  });

  describe('deleteOne', () => {
    it('should delete a record successfully', async () => {
      const mockWhere = { id: 'uuid-123' };
      
      mockTaskModel.destroy.mockResolvedValue(1);

      const result = await postgresHelper.deleteOne(mockTaskModel, mockWhere);

      expect(result.status).toBe(true);
      expect(result.data.deletedCount).toBe(1);
      expect(mockTaskModel.destroy).toHaveBeenCalledWith({ where: mockWhere });
    });

    it('should return error when no records deleted', async () => {
      mockTaskModel.destroy.mockResolvedValue(0);

      const result = await postgresHelper.deleteOne(mockTaskModel, {});

      expect(result.status).toBe(false);
      expect(result.message).toBe('No data deleted');
    });
  });

  describe('getManyPaginated', () => {
    it('should return paginated results with metadata', async () => {
      const mockData = [{ id: '1' }, { id: '2' }];
      const mockCount = 10;
      
      mockTaskModel.count.mockResolvedValue(mockCount);
      mockTaskModel.findAll.mockResolvedValue(mockData);

      const result = await postgresHelper.getManyPaginated(mockTaskModel, {}, { page: 1, pageSize: 10 });

      expect(result.status).toBe(true);
      expect(result.data).toEqual(mockData);
      expect(result.pagination).toMatchObject({
        currentPage: 1,
        pageSize: 10,
        totalItems: mockCount,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      });
    });

    it('should enforce max page size of 100', async () => {
      mockTaskModel.count.mockResolvedValue(0);
      mockTaskModel.findAll.mockResolvedValue([]);

      await postgresHelper.getManyPaginated(mockTaskModel, {}, { page: 1, pageSize: 200 });

      expect(mockTaskModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 100
        })
      );
    });
  });
});
