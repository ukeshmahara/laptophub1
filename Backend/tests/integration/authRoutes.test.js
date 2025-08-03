import request from 'supertest';
import express from 'express';
import { authRouter } from '../../src/route/auth/authRoute.js';
import { User } from '../../src/models/index.js';
import bcrypt from 'bcrypt';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('Auth Routes Integration Tests', () => {
  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      // Arrange
      const hashedPassword = await bcrypt.hash('password123', 10);
      const testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword
      });

      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data.user).not.toHaveProperty('password');
      expect(response.body.message).toBe('Login successful');
    });

    it('should return 400 when email or password is missing', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com'
        // Missing password
      };

      // Act & Assert
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email and password are required');
    });

    it('should return 401 when user does not exist', async () => {
      // Arrange
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      // Act & Assert
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should return 401 when password is incorrect', async () => {
      // Arrange
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword
      });

      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      // Act & Assert
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register successfully with valid data', async () => {
      // Arrange
      const registerData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        address: '456 New St',
        phoneNumber: '9876543210'
      };

      // Act
      const response = await request(app)
        .post('/api/auth/register')
        .send(registerData)
        .expect(201);

      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.name).toBe(registerData.name);
      expect(response.body.data.user.email).toBe(registerData.email);
      expect(response.body.data.user).not.toHaveProperty('password');
      expect(response.body.message).toBe('Registration successful');

      // Verify user was actually created in database
      const createdUser = await User.findOne({ where: { email: registerData.email } });
      expect(createdUser).toBeDefined();
      expect(createdUser.name).toBe(registerData.name);
    });

    it('should return 400 when required fields are missing', async () => {
      // Arrange
      const registerData = {
        name: 'Test User',
        email: 'test@example.com'
        // Missing password
      };

      // Act & Assert
      const response = await request(app)
        .post('/api/auth/register')
        .send(registerData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Name, email, and password are required');
    });

    it('should return 400 when user with email already exists', async () => {
      // Arrange
      const existingUser = await User.create({
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password123'
      });

      const registerData = {
        name: 'Another User',
        email: 'existing@example.com',
        password: 'password123'
      };

      // Act & Assert
      const response = await request(app)
        .post('/api/auth/register')
        .send(registerData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User with this email already exists');
    });

    it('should hash password during registration', async () => {
      // Arrange
      const registerData = {
        name: 'Password Test User',
        email: 'passwordtest@example.com',
        password: 'plaintextpassword'
      };

      // Act
      await request(app)
        .post('/api/auth/register')
        .send(registerData)
        .expect(201);

      // Assert - Check that password was hashed
      const createdUser = await User.findOne({ where: { email: registerData.email } });
      expect(createdUser).toBeDefined();
      expect(createdUser.password).not.toBe(registerData.password);
      
      // Verify password can be verified
      const isPasswordValid = await bcrypt.compare(registerData.password, createdUser.password);
      expect(isPasswordValid).toBe(true);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user data with valid token', async () => {
      // Arrange
      const testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      // Login to get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      const token = loginResponse.body.data.token;

      // Act
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testUser.id);
      expect(response.body.data.email).toBe(testUser.email);
      expect(response.body.data).not.toHaveProperty('password');
      expect(response.body.message).toBe('User data retrieved successfully');
    });

    it('should return 401 when no token is provided', async () => {
      // Act & Assert
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return 401 when invalid token is provided', async () => {
      // Act & Assert
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON', async () => {
      // Act & Assert
      const response = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);
    });

    it('should handle empty request body', async () => {
      // Act & Assert
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email and password are required');
    });
  });
}); 