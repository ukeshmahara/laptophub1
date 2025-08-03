import jwt from 'jsonwebtoken';
import { 
  authenticateToken, 
  requireAdmin, 
  requireAuth 
} from '../../src/middleware/token-middleware.js';
import { 
  createMockRequest, 
  createMockResponse, 
  createMockNext,
  generateTestToken
} from '../utils/testUtils.js';

// Mock jwt
jest.mock('jsonwebtoken');

describe('Token Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    mockNext = createMockNext();
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('authenticateToken', () => {
    it('should authenticate valid token and set user in request', () => {
      // Arrange
      const mockUser = { id: 1, email: 'test@example.com', isAdmin: false };
      const mockToken = 'valid-token';
      
      mockReq.headers = {
        authorization: `Bearer ${mockToken}`
      };
      
      jwt.verify.mockReturnValue(mockUser);

      // Act
      authenticateToken(mockReq, mockRes, mockNext);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
      expect(mockReq.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 401 when no authorization header is present', () => {
      // Arrange
      mockReq.headers = {};

      // Act
      authenticateToken(mockReq, mockRes, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access token required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header is malformed', () => {
      // Arrange
      mockReq.headers = {
        authorization: 'InvalidFormat'
      };

      // Act
      authenticateToken(mockReq, mockRes, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access token required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when token is invalid', () => {
      // Arrange
      const mockToken = 'invalid-token';
      mockReq.headers = {
        authorization: `Bearer ${mockToken}`
      };
      
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act
      authenticateToken(mockReq, mockRes, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid or expired token'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when token is expired', () => {
      // Arrange
      const mockToken = 'expired-token';
      mockReq.headers = {
        authorization: `Bearer ${mockToken}`
      };
      
      jwt.verify.mockImplementation(() => {
        throw new Error('TokenExpiredError');
      });

      // Act
      authenticateToken(mockReq, mockRes, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid or expired token'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle token without Bearer prefix', () => {
      // Arrange
      const mockUser = { id: 1, email: 'test@example.com', isAdmin: false };
      const mockToken = 'valid-token';
      
      mockReq.headers = {
        authorization: mockToken // No Bearer prefix
      };
      
      jwt.verify.mockReturnValue(mockUser);

      // Act
      authenticateToken(mockReq, mockRes, mockNext);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
      expect(mockReq.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('requireAdmin', () => {
    it('should allow admin users to proceed', () => {
      // Arrange
      mockReq.user = { id: 1, email: 'admin@example.com', isAdmin: true };

      // Act
      requireAdmin(mockReq, mockRes, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('should return 403 when user is not admin', () => {
      // Arrange
      mockReq.user = { id: 1, email: 'user@example.com', isAdmin: false };

      // Act
      requireAdmin(mockReq, mockRes, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Admin access required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when user isAdmin is undefined', () => {
      // Arrange
      mockReq.user = { id: 1, email: 'user@example.com' }; // No isAdmin property

      // Act
      requireAdmin(mockReq, mockRes, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Admin access required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('requireAuth', () => {
    it('should allow authenticated users to proceed', () => {
      // Arrange
      mockReq.user = { id: 1, email: 'user@example.com', isAdmin: false };

      // Act
      requireAuth(mockReq, mockRes, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('should return 401 when user is not authenticated', () => {
      // Arrange
      mockReq.user = null;

      // Act
      requireAuth(mockReq, mockRes, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Authentication required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when user is undefined', () => {
      // Arrange
      mockReq.user = undefined;

      // Act
      requireAuth(mockReq, mockRes, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Authentication required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Middleware Chain', () => {
    it('should work correctly when chained together', () => {
      // Arrange
      const mockUser = { id: 1, email: 'admin@example.com', isAdmin: true };
      const mockToken = 'valid-token';
      
      mockReq.headers = {
        authorization: `Bearer ${mockToken}`
      };
      
      jwt.verify.mockReturnValue(mockUser);

      // Act - First authenticate
      authenticateToken(mockReq, mockRes, mockNext);
      
      // Reset next mock
      mockNext.mockClear();
      
      // Then check admin
      requireAdmin(mockReq, mockRes, mockNext);

      // Assert
      expect(mockReq.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should fail admin check when user is not admin after authentication', () => {
      // Arrange
      const mockUser = { id: 1, email: 'user@example.com', isAdmin: false };
      const mockToken = 'valid-token';
      
      mockReq.headers = {
        authorization: `Bearer ${mockToken}`
      };
      
      jwt.verify.mockReturnValue(mockUser);

      // Act - First authenticate
      authenticateToken(mockReq, mockRes, mockNext);
      
      // Reset next mock
      mockNext.mockClear();
      
      // Then check admin
      requireAdmin(mockReq, mockRes, mockNext);

      // Assert
      expect(mockReq.user).toEqual(mockUser);
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Admin access required'
      });
    });
  });
}); 