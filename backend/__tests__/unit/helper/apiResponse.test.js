import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import * as apiResponse from '../../../helper/apiResponse.js';

describe('API Response Helpers', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('successResponse', () => {
    it('should return 200 status with message', () => {
      apiResponse.successResponse(mockRes, 'Success message');
      
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 200,
        message: 'Success message'
      });
    });
  });

  describe('successResponseWithData', () => {
    it('should return 200 status with message and data', () => {
      const testData = { id: 1, name: 'Test' };
      apiResponse.successResponseWithData(mockRes, 'Success message', testData);
      
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 200,
        message: 'Success message',
        data: testData
      });
    });
  });

  describe('errorResponse', () => {
    it('should return 500 status with error message', () => {
      const error = new Error('Test error');
      apiResponse.errorResponse(mockRes, 'Error message', error);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 500,
        message: 'Error message',
        Error: error
      });
    });
  });

  describe('notFoundResponse', () => {
    it('should return 404 status with message', () => {
      apiResponse.notFoundResponse(mockRes, 'Not found message');
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 404,
        message: 'Not found message',
        data: {}
      });
    });
  });

  describe('validationError', () => {
    it('should return 400 status with validation message', () => {
      apiResponse.validationError(mockRes, 'Validation error');
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 400,
        message: 'Validation error'
      });
    });
  });

  describe('validationErrorWithData', () => {
    it('should return 400 status with validation message and data', () => {
      const data = { field: 'email', error: 'Invalid format' };
      apiResponse.validationErrorWithData(mockRes, 'Validation error', data);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 400,
        message: 'Validation error',
        data: data
      });
    });
  });

  describe('unAuthorizedResponse', () => {
    it('should return 401 status with unauthorized message', () => {
      apiResponse.unAuthorizedResponse(mockRes, 'Unauthorized');
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 401,
        message: 'Unauthorized'
      });
    });
  });

  describe('duplicateResponse', () => {
    it('should return 409 status with duplicate message', () => {
      apiResponse.duplicateResponse(mockRes, 'Duplicate entry');
      
      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 409,
        message: 'Duplicate entry'
      });
    });
  });
});

