import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock the User model before importing
const mockUserModel = {
  create: jest.fn(),
  insertMany: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
  countDocuments: jest.fn(),
};

jest.unstable_mockModule('../../../models/user/user.js', () => ({
  default: mockUserModel
}));

// Now import after mocking
const mongoHelper = await import('../../../helper/mongo.js');

describe('MongoDB Helper Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new document successfully', async () => {
      const mockData = { name: 'Test User', email: 'test@example.com' };
      const mockResult = { _id: '123', ...mockData };
      
      mockUserModel.create.mockResolvedValue(mockResult);

      const result = await mongoHelper.create(mockUserModel, mockData);

      expect(result.status).toBe(true);
      expect(result.data).toEqual(mockResult);
      expect(mockUserModel.create).toHaveBeenCalledWith(mockData);
    });

    it('should return error when creation fails', async () => {
      mockUserModel.create.mockResolvedValue(null);

      const result = await mongoHelper.create(mockUserModel, {});

      expect(result.status).toBe(false);
      expect(result.message).toBe('Data not created');
    });

    it('should handle errors during creation', async () => {
      const error = new Error('Database error');
      mockUserModel.create.mockRejectedValue(error);

      const result = await mongoHelper.create(mockUserModel, {});

      expect(result.status).toBe(false);
      expect(result.error).toBe(error);
    });
  });

  describe('getOne', () => {
    it('should find one document successfully', async () => {
      const mockQuery = { email: 'test@example.com' };
      const mockResult = { _id: '123', email: 'test@example.com' };
      
      mockUserModel.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockResult)
      });

      const result = await mongoHelper.getOne(mockUserModel, mockQuery);

      expect(result.status).toBe(true);
      expect(result.data).toEqual(mockResult);
    });

    it('should return error when document not found', async () => {
      mockUserModel.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      });

      const result = await mongoHelper.getOne(mockUserModel, {});

      expect(result.status).toBe(false);
      expect(result.message).toBe('No data found');
    });
  });

  describe('getMany', () => {
    it('should find multiple documents successfully', async () => {
      const mockResults = [
        { _id: '1', name: 'User 1' },
        { _id: '2', name: 'User 2' }
      ];
      
      mockUserModel.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockResults)
      });

      const result = await mongoHelper.getMany(mockUserModel, {});

      expect(result.status).toBe(true);
      expect(result.data).toEqual(mockResults);
    });

    it('should return error when no documents found', async () => {
      mockUserModel.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue([])
      });

      const result = await mongoHelper.getMany(mockUserModel, {});

      expect(result.status).toBe(false);
      expect(result.message).toBe('No data found');
    });
  });

  describe('getManyPaginated', () => {
    it('should return paginated results with metadata', async () => {
      const mockData = [{ _id: '1' }, { _id: '2' }];
      const mockCount = 10;
      
      mockUserModel.countDocuments.mockResolvedValue(mockCount);
      mockUserModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockData)
      });

      const result = await mongoHelper.getManyPaginated(mockUserModel, {}, { page: 1, pageSize: 10 });

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
      mockUserModel.countDocuments.mockResolvedValue(0);
      mockUserModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      });

      await mongoHelper.getManyPaginated(mockUserModel, {}, { page: 1, pageSize: 200 });

      expect(mockUserModel.find().limit).toHaveBeenCalledWith(100);
    });
  });
});
