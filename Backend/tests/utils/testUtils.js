import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../../src/models/index.js';

// Create a test user
export const createTestUser = async (userData = {}) => {
  const defaultUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    address: '123 Test St',
    phoneNumber: '1234567890',
    isAdmin: false
  };

  const userToCreate = { ...defaultUser, ...userData };
  
  // Hash password
  const hashedPassword = await bcrypt.hash(userToCreate.password, 10);
  
  // Create user
  const user = await User.create({
    ...userToCreate,
    password: hashedPassword
  });

  return user;
};

// Generate JWT token for testing
export const generateTestToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      isAdmin: user.isAdmin 
    },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
};

// Create mock request object
export const createMockRequest = (data = {}) => {
  return {
    body: data.body || {},
    params: data.params || {},
    query: data.query || {},
    headers: data.headers || {},
    user: data.user || null,
    ...data
  };
};

// Create mock response object
export const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

// Create mock next function
export const createMockNext = () => {
  return jest.fn();
};

// Helper to create authenticated request
export const createAuthenticatedRequest = (user, data = {}) => {
  const token = generateTestToken(user);
  return createMockRequest({
    ...data,
    headers: {
      ...data.headers,
      authorization: `Bearer ${token}`
    },
    user: user
  });
};

// Helper to validate response structure
export const validateResponseStructure = (response, expectedStatus = 200) => {
  expect(response.status).toHaveBeenCalledWith(expectedStatus);
  expect(response.json).toHaveBeenCalled();
  
  const responseData = response.json.mock.calls[0][0];
  expect(responseData).toHaveProperty('success');
  expect(typeof responseData.success).toBe('boolean');
  
  return responseData;
};

// Helper to validate error response
export const validateErrorResponse = (response, expectedStatus = 400) => {
  expect(response.status).toHaveBeenCalledWith(expectedStatus);
  expect(response.json).toHaveBeenCalled();
  
  const responseData = response.json.mock.calls[0][0];
  expect(responseData.success).toBe(false);
  expect(responseData).toHaveProperty('message');
  
  return responseData;
}; 