import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { login, register, getCurrentUser } from '../../src/controller/auth/authController.js';
import { User } from '../../src/models/index.js';
import { 
  createTestUser, 
  createMockRequest, 
  createMockResponse, 
  createMockNext,
  createAuthenticatedRequest,
  validateResponseStructure,
  validateErrorResponse
} from '../utils/testUtils.js';

// Mock bcrypt and jwt
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    mockNext = createMockNext();
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      // Arrange
      const testUser = await createTestUser({
        email: 'test@example.com',
        password: 'password123'
      });

      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      mockReq.body = loginData;
      
      // Mock bcrypt.compare to return true
      bcrypt.compare.mockResolvedValue(true);
      
      // Mock jwt.sign to return a token
      const mockToken = 'mock-jwt-token';
      jwt.sign.mockReturnValue(mockToken);

      // Act
      await login(mockReq, mockRes);

      // Assert
      const responseData = validateResponseStructure(mockRes, 200);
      expect(responseData.success).toBe(true);
      expect(responseData.data).toHaveProperty('user');
      expect(responseData.data).toHaveProperty('token');
      expect(responseData.data.token).toBe(mockToken);
      expect(responseData.data.user.email).toBe(loginData.email);
      expect(responseData.data.user).not.toHaveProperty('password');
      expect(responseData.message).toBe('Login successful');
    });

    it('should return 400 when email or password is missing', async () => {
      // Arrange
      mockReq.body = { email: 'test@example.com' }; // Missing password

      // Act
      await login(mockReq, mockRes);

      // Assert
      const responseData = validateErrorResponse(mockRes, 400);
      expect(responseData.message).toBe('Email and password are required');
    });

    it('should return 401 when user does not exist', async () => {
      // Arrange
      mockReq.body = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      // Act
      await login(mockReq, mockRes);

      // Assert
      const responseData = validateErrorResponse(mockRes, 401);
      expect(responseData.message).toBe('Invalid email or password');
    });

    it('should return 401 when password is incorrect', async () => {
      // Arrange
      const testUser = await createTestUser({
        email: 'test@example.com',
        password: 'password123'
      });

      mockReq.body = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      // Mock bcrypt.compare to return false
      bcrypt.compare.mockResolvedValue(false);

      // Act
      await login(mockReq, mockRes);

      // Assert
      const responseData = validateErrorResponse(mockRes, 401);
      expect(responseData.message).toBe('Invalid email or password');
    });

    it('should handle database errors during login', async () => {
      // Arrange
      mockReq.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Mock User.findOne to throw an error
      jest.spyOn(User, 'findOne').mockRejectedValue(new Error('Database error'));

      // Act
      await login(mockReq, mockRes);

      // Assert
      const responseData = validateErrorResponse(mockRes, 500);
      expect(responseData.message).toBe('Error during login');
    });
  });

  describe('register', () => {
    it('should register successfully with valid data', async () => {
      // Arrange
      const registerData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        address: '456 New St',
        phoneNumber: '9876543210'
      };

      mockReq.body = registerData;
      
      // Mock bcrypt.hash to return hashed password
      const hashedPassword = 'hashed-password';
      bcrypt.hash.mockResolvedValue(hashedPassword);
      
      // Mock jwt.sign to return a token
      const mockToken = 'mock-jwt-token';
      jwt.sign.mockReturnValue(mockToken);

      // Act
      await register(mockReq, mockRes);

      // Assert
      const responseData = validateResponseStructure(mockRes, 201);
      expect(responseData.success).toBe(true);
      expect(responseData.data).toHaveProperty('user');
      expect(responseData.data).toHaveProperty('token');
      expect(responseData.data.user.name).toBe(registerData.name);
      expect(responseData.data.user.email).toBe(registerData.email);
      expect(responseData.data.user).not.toHaveProperty('password');
      expect(responseData.message).toBe('Registration successful');
    });

    it('should return 400 when required fields are missing', async () => {
      // Arrange
      mockReq.body = {
        name: 'Test User',
        email: 'test@example.com'
        // Missing password
      };

      // Act
      await register(mockReq, mockRes);

      // Assert
      const responseData = validateErrorResponse(mockRes, 400);
      expect(responseData.message).toBe('Name, email, and password are required');
    });

    it('should return 400 when user with email already exists', async () => {
      // Arrange
      const existingUser = await createTestUser({
        email: 'existing@example.com'
      });

      mockReq.body = {
        name: 'Another User',
        email: 'existing@example.com',
        password: 'password123'
      };

      // Act
      await register(mockReq, mockRes);

      // Assert
      const responseData = validateErrorResponse(mockRes, 400);
      expect(responseData.message).toBe('User with this email already exists');
    });

    it('should handle database errors during registration', async () => {
      // Arrange
      mockReq.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      // Mock User.create to throw an error
      jest.spyOn(User, 'create').mockRejectedValue(new Error('Database error'));

      // Act
      await register(mockReq, mockRes);

      // Assert
      const responseData = validateErrorResponse(mockRes, 500);
      expect(responseData.message).toBe('Error during registration');
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user data successfully', async () => {
      // Arrange
      const testUser = await createTestUser();
      mockReq.user = { id: testUser.id };

      // Act
      await getCurrentUser(mockReq, mockRes);

      // Assert
      const responseData = validateResponseStructure(mockRes, 200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.id).toBe(testUser.id);
      expect(responseData.data.email).toBe(testUser.email);
      expect(responseData.data).not.toHaveProperty('password');
      expect(responseData.message).toBe('User data retrieved successfully');
    });

    it('should return 404 when user is not found', async () => {
      // Arrange
      mockReq.user = { id: 99999 }; // Non-existent user ID

      // Act
      await getCurrentUser(mockReq, mockRes);

      // Assert
      const responseData = validateErrorResponse(mockRes, 404);
      expect(responseData.message).toBe('User not found');
    });

    it('should handle database errors when fetching current user', async () => {
      // Arrange
      mockReq.user = { id: 1 };

      // Mock User.findByPk to throw an error
      jest.spyOn(User, 'findByPk').mockRejectedValue(new Error('Database error'));

      // Act
      await getCurrentUser(mockReq, mockRes);

      // Assert
      const responseData = validateErrorResponse(mockRes, 500);
      expect(responseData.message).toBe('Error fetching user data');
    });
  });
}); 