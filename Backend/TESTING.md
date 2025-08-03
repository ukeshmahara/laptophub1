# Backend Testing Guide

This document provides a comprehensive guide to the testing setup for the LaptopHub backend API.

## Overview

The backend uses Jest as the testing framework with the following testing structure:

- **Unit Tests**: Test individual functions and methods in isolation
- **Integration Tests**: Test API endpoints and database interactions
- **Model Tests**: Test Sequelize models and database operations
- **Middleware Tests**: Test authentication and authorization middleware

## Test Structure

```
tests/
├── setup.js                    # Global test setup and teardown
├── utils/
│   └── testUtils.js           # Common test utilities and helpers
├── controllers/
│   ├── authController.test.js # Auth controller unit tests
│   └── laptopController.test.js # Laptop controller unit tests
├── models/
│   ├── User.test.js           # User model tests
│   └── Laptop.test.js         # Laptop model tests
├── middleware/
│   └── tokenMiddleware.test.js # Authentication middleware tests
└── integration/
    └── authRoutes.test.js     # Auth routes integration tests
```

## Prerequisites

1. **Database Setup**: Ensure you have a test database configured
2. **Environment Variables**: Create a `test.env` file with test-specific configurations
3. **Dependencies**: All testing dependencies are already installed

## Configuration

### Test Environment File (`test.env`)

```env
NODE_ENV=test
PORT=4001
DB_NAME=laptophub_test
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
JWT_SECRET=test-jwt-secret-key-for-testing-only
TEST_TIMEOUT=10000
```

### Jest Configuration (`jest.config.js`)

- ES6 module support
- Coverage reporting
- Test timeout settings
- Mock cleanup between tests

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode (for development)
```bash
npm run test:watch
```

### With Coverage Report
```bash
npm run test:coverage
```

### Verbose Output
```bash
npm run test:verbose
```

### Specific Test Categories
```bash
# Auth-related tests only
npm run test:auth

# Model tests only
npm run test:models

# Middleware tests only
npm run test:middleware

# Integration tests only
npm run test:integration
```

## Test Categories

### 1. Unit Tests

#### Controller Tests
- Test individual controller functions
- Mock database operations
- Verify response structures
- Test error handling

**Example:**
```javascript
describe('login', () => {
  it('should login successfully with valid credentials', async () => {
    // Arrange
    const mockUser = { /* user data */ };
    jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
    
    // Act
    await login(mockReq, mockRes);
    
    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      data: { user: mockUser, token: expect.any(String) }
    });
  });
});
```

#### Model Tests
- Test Sequelize model operations
- Verify data validation
- Test relationships and associations
- Test CRUD operations

**Example:**
```javascript
describe('User Creation', () => {
  it('should create a user with valid data', async () => {
    const userData = { name: 'Test', email: 'test@example.com' };
    const user = await User.create(userData);
    
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
  });
});
```

### 2. Integration Tests

#### Route Tests
- Test complete API endpoints
- Use Supertest for HTTP requests
- Test with real database operations
- Verify end-to-end functionality

**Example:**
```javascript
describe('POST /api/auth/login', () => {
  it('should login successfully', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('token');
  });
});
```

### 3. Middleware Tests

#### Authentication Tests
- Test JWT token validation
- Test authorization middleware
- Test error responses
- Test middleware chaining

**Example:**
```javascript
describe('authenticateToken', () => {
  it('should authenticate valid token', () => {
    mockReq.headers = { authorization: 'Bearer valid-token' };
    jwt.verify.mockReturnValue({ id: 1, email: 'test@example.com' });
    
    authenticateToken(mockReq, mockRes, mockNext);
    
    expect(mockReq.user).toBeDefined();
    expect(mockNext).toHaveBeenCalled();
  });
});
```

## Test Utilities

### Common Test Helpers (`tests/utils/testUtils.js`)

#### Mock Objects
- `createMockRequest()`: Create mock Express request objects
- `createMockResponse()`: Create mock Express response objects
- `createMockNext()`: Create mock Express next functions

#### Test Data
- `createTestUser()`: Create test user data
- `generateTestToken()`: Generate JWT tokens for testing

#### Validation Helpers
- `validateResponseStructure()`: Validate API response format
- `validateErrorResponse()`: Validate error response format

#### Authentication Helpers
- `createAuthenticatedRequest()`: Create requests with valid tokens

## Best Practices

### 1. Test Organization
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Group related tests in describe blocks
- Use beforeEach/afterEach for setup/cleanup

### 2. Mocking
- Mock external dependencies (database, external APIs)
- Use jest.spyOn() for method mocking
- Reset mocks between tests
- Mock only what's necessary

### 3. Database Testing
- Use separate test database
- Clean up data between tests
- Test with real database operations in integration tests
- Use transactions when possible

### 4. Error Testing
- Test both success and failure scenarios
- Verify error messages and status codes
- Test edge cases and invalid inputs
- Test database connection errors

### 5. Coverage
- Aim for high test coverage (80%+)
- Focus on critical business logic
- Test error handling paths
- Include integration tests for important workflows

## Common Patterns

### Testing Async Functions
```javascript
it('should handle async operations', async () => {
  const result = await someAsyncFunction();
  expect(result).toBeDefined();
});
```

### Testing Error Cases
```javascript
it('should handle errors gracefully', async () => {
  await expect(asyncFunction()).rejects.toThrow('Expected error message');
});
```

### Testing Database Operations
```javascript
it('should create record in database', async () => {
  const record = await Model.create(data);
  expect(record.id).toBeDefined();
  
  const found = await Model.findByPk(record.id);
  expect(found).toBeDefined();
});
```

### Testing Middleware
```javascript
it('should call next() on success', () => {
  middleware(mockReq, mockRes, mockNext);
  expect(mockNext).toHaveBeenCalled();
});
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure test database exists
   - Check database credentials in test.env
   - Verify database server is running

2. **Import/Export Errors**
   - Check ES6 module configuration
   - Verify file extensions (.js)
   - Ensure proper import paths

3. **Test Timeout Errors**
   - Increase timeout in jest.config.js
   - Check for hanging async operations
   - Verify proper cleanup in afterEach

4. **Mock Issues**
   - Reset mocks in beforeEach
   - Check mock implementation
   - Verify mock is called correctly

### Debugging Tests

1. **Run Single Test**
   ```bash
   npm test -- --testNamePattern="specific test name"
   ```

2. **Verbose Output**
   ```bash
   npm run test:verbose
   ```

3. **Debug Mode**
   ```bash
   node --inspect-brk node_modules/.bin/jest --runInBand
   ```

## Continuous Integration

The testing setup is designed to work with CI/CD pipelines:

1. **Database Setup**: Use test database in CI environment
2. **Environment Variables**: Set test environment variables
3. **Coverage Reports**: Generate and publish coverage reports
4. **Test Results**: Report test results and failures

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure all tests pass
3. Maintain or improve test coverage
4. Update this documentation if needed
5. Follow existing test patterns and conventions 