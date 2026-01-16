import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Create mocks before importing
const mockApiResponse = {
  validationError: jest.fn(),
  validationErrorWithData: jest.fn(),
  notFoundResponse: jest.fn(),
  unAuthorizedResponse: jest.fn(),
  successResponseWithData: jest.fn(),
  errorResponse: jest.fn(),
};

const mockVerifyToken = jest.fn();
const mockGenerateToken = jest.fn();

const mockMongoHelper = {
  create: jest.fn(),
  getOne: jest.fn(),
};

const mockUserModel = {};

// Mock all dependencies
jest.unstable_mockModule('../../../helper/apiResponse.js', () => mockApiResponse);
jest.unstable_mockModule('../../../controllers/auth/jwt.js', () => ({
  generateToken: mockGenerateToken,
  verifyToken: mockVerifyToken,
}));
jest.unstable_mockModule('../../../models/user/user.js', () => ({ default: mockUserModel }));
jest.unstable_mockModule('../../../helper/mongo.js', () => mockMongoHelper);

// Import after mocking
const authController = await import('../../../controllers/auth/auth.js');

describe('Auth Controller', () => {
  let mockRequest, mockResponse, mockNext;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      body: {},
      method: 'GET',
      token: null,
      auth: null
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('isAuth middleware', () => {
    it('should return 404 when no token provided', async () => {
      mockRequest.headers = {};

      await authController.isAuth(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when token is invalid', async () => {
      mockRequest.headers = { authorization: 'Bearer invalid-token' };
      // verifyToken returns a promise that rejects - need to ensure it's called with correct args
      mockVerifyToken.mockRejectedValueOnce(new Error('Invalid token'));

      // Wait for the async operation to complete
      await new Promise(resolve => {
        authController.isAuth(mockRequest, mockResponse, mockNext);
        setTimeout(resolve, 10);
      });

      expect(mockVerifyToken).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next when token is valid (GET request)', async () => {
      const mockAuth = { userId: '123', exp: Date.now() / 1000 + 3600 };
      mockRequest.headers = { authorization: 'Bearer valid-token' };
      mockRequest.method = 'GET';
      mockVerifyToken.mockResolvedValue(mockAuth);

      await authController.isAuth(mockRequest, mockResponse, mockNext);

      expect(mockRequest.auth).toEqual(mockAuth);
      expect(mockRequest.token).toBe('valid-token');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should call next when token is valid (POST request)', async () => {
      const mockAuth = { userId: '123', exp: Date.now() / 1000 + 3600 };
      mockRequest.headers = { authorization: 'Bearer valid-token' };
      mockRequest.method = 'POST';
      mockVerifyToken.mockResolvedValue(mockAuth);

      await authController.isAuth(mockRequest, mockResponse, mockNext);

      expect(mockRequest.body.auth).toEqual(mockAuth);
      expect(mockRequest.body.token).toBe('valid-token');
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should return validation error when fields are missing', async () => {
      mockRequest.body = { name: 'Test' };
      mockApiResponse.validationError.mockReturnValue(mockResponse);

      await authController.register(mockRequest, mockResponse, mockNext);

      expect(mockApiResponse.validationError).toHaveBeenCalledWith(
        mockResponse,
        'All fields are required'
      );
    });

    it('should register user successfully', async () => {
      mockRequest.body = {
        name: 'Test User',
        email: 'test@example.com',
        mobile: '1234567890',
        password: 'password123'
      };
      const mockUser = { _id: 'user123', ...mockRequest.body };
      mockMongoHelper.create.mockResolvedValue({ status: true, data: mockUser });

      await authController.register(mockRequest, mockResponse, mockNext);

      expect(mockRequest.body.authUser).toEqual({ _id: 'user123' });
      expect(mockNext).toHaveBeenCalled();
    });

    it('should return error when registration fails', async () => {
      mockRequest.body = {
        name: 'Test User',
        email: 'test@example.com',
        mobile: '1234567890',
        password: 'password123'
      };
      mockMongoHelper.create.mockResolvedValue({ status: false });
      mockApiResponse.notFoundResponse.mockReturnValue(mockResponse);

      await authController.register(mockRequest, mockResponse, mockNext);

      expect(mockApiResponse.notFoundResponse).toHaveBeenCalledWith(
        mockResponse,
        'Unable to register user'
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return validation error when password is missing', async () => {
      mockRequest.body = { token: 'test-token' };
      mockApiResponse.validationErrorWithData.mockReturnValue(mockResponse);

      await authController.login(mockRequest, mockResponse);

      expect(mockApiResponse.validationErrorWithData).toHaveBeenCalledWith(
        mockResponse,
        'Password is required'
      );
    });

    it('should return unauthorized when token is missing', async () => {
      mockRequest.body = { password: 'password123' };
      mockApiResponse.unAuthorizedResponse.mockReturnValue(mockResponse);

      await authController.login(mockRequest, mockResponse);

      expect(mockApiResponse.unAuthorizedResponse).toHaveBeenCalledWith(
        mockResponse,
        'Authentication token required'
      );
    });

    it('should return error when password is invalid', async () => {
      mockRequest.body = {
        token: 'test-token',
        password: 'wrong-password',
        authUser: { password: 'correct-password' }
      };
      mockApiResponse.notFoundResponse.mockReturnValue(mockResponse);

      await authController.login(mockRequest, mockResponse);

      expect(mockApiResponse.notFoundResponse).toHaveBeenCalledWith(
        mockResponse,
        'Invalid password!'
      );
    });

    it('should login successfully with valid credentials', async () => {
      mockRequest.body = {
        token: 'test-token',
        password: 'password123',
        authUser: { password: 'password123' }
      };
      mockApiResponse.successResponseWithData.mockReturnValue(mockResponse);

      await authController.login(mockRequest, mockResponse);

      expect(mockApiResponse.successResponseWithData).toHaveBeenCalledWith(
        mockResponse,
        'Login Successful!',
        'test-token'
      );
    });
  });

  describe('getAuthUser', () => {
    it('should return error when mobile is not provided', async () => {
      mockRequest.body = {};
      mockApiResponse.notFoundResponse.mockReturnValue(mockResponse);

      await authController.getAuthUser(mockRequest, mockResponse, mockNext);

      expect(mockApiResponse.notFoundResponse).toHaveBeenCalledWith(
        mockResponse,
        'Please provide a mobile number'
      );
    });

    it('should call next when user not found', async () => {
      mockRequest.body = { mobile: '1234567890' };
      mockMongoHelper.getOne.mockResolvedValue({ status: false });

      await authController.getAuthUser(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should set authUser when user is found', async () => {
      const mockUser = { _id: '123', mobile: '1234567890' };
      mockRequest.body = { mobile: '1234567890' };
      mockMongoHelper.getOne.mockResolvedValue({ status: true, data: mockUser });

      await authController.getAuthUser(mockRequest, mockResponse, mockNext);

      expect(mockRequest.body.authUser).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
