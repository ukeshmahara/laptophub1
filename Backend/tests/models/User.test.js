import { User } from '../../src/models/index.js';
import bcrypt from 'bcrypt';

describe('User Model', () => {
  describe('User Creation', () => {
    it('should create a user with valid data', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        address: '123 Test St',
        phoneNumber: '1234567890',
        isAdmin: false
      };

      // Act
      const user = await User.create(userData);

      // Assert
      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.password).toBe(userData.password);
      expect(user.address).toBe(userData.address);
      expect(user.phoneNumber).toBe(userData.phoneNumber);
      expect(user.isAdmin).toBe(userData.isAdmin);
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should create a user with minimal required data', async () => {
      // Arrange
      const userData = {
        name: 'Minimal User',
        email: 'minimal@example.com',
        password: 'password123'
      };

      // Act
      const user = await User.create(userData);

      // Assert
      expect(user).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.password).toBe(userData.password);
      expect(user.isAdmin).toBe(false); // Default value
      expect(user.address).toBeNull();
      expect(user.phoneNumber).toBeNull();
    });

    it('should not create a user without required fields', async () => {
      // Arrange
      const userData = {
        name: 'Test User'
        // Missing email and password
      };

      // Act & Assert
      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should not create a user with duplicate email', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'password123'
      };

      // Create first user
      await User.create(userData);

      // Act & Assert - Try to create second user with same email
      await expect(User.create(userData)).rejects.toThrow();
    });
  });

  describe('User Validation', () => {
    it('should validate email format', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123'
      };

      // Act & Assert
      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should require non-empty name', async () => {
      // Arrange
      const userData = {
        name: '',
        email: 'test@example.com',
        password: 'password123'
      };

      // Act & Assert
      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should require non-empty password', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: ''
      };

      // Act & Assert
      await expect(User.create(userData)).rejects.toThrow();
    });
  });

  describe('User Queries', () => {
    beforeEach(async () => {
      // Create test users
      await User.create({
        name: 'User 1',
        email: 'user1@example.com',
        password: 'password123',
        isAdmin: false
      });

      await User.create({
        name: 'User 2',
        email: 'user2@example.com',
        password: 'password123',
        isAdmin: true
      });

      await User.create({
        name: 'User 3',
        email: 'user3@example.com',
        password: 'password123',
        isAdmin: false
      });
    });

    it('should find user by email', async () => {
      // Act
      const user = await User.findOne({ where: { email: 'user1@example.com' } });

      // Assert
      expect(user).toBeDefined();
      expect(user.name).toBe('User 1');
      expect(user.email).toBe('user1@example.com');
    });

    it('should find user by primary key', async () => {
      // Arrange
      const createdUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      // Act
      const user = await User.findByPk(createdUser.id);

      // Assert
      expect(user).toBeDefined();
      expect(user.id).toBe(createdUser.id);
      expect(user.name).toBe('Test User');
    });

    it('should find all users', async () => {
      // Act
      const users = await User.findAll();

      // Assert
      expect(users).toBeDefined();
      expect(users.length).toBeGreaterThanOrEqual(3);
    });

    it('should find users with specific conditions', async () => {
      // Act
      const adminUsers = await User.findAll({ where: { isAdmin: true } });

      // Assert
      expect(adminUsers).toBeDefined();
      expect(adminUsers.length).toBe(1);
      expect(adminUsers[0].isAdmin).toBe(true);
    });

    it('should return null when user not found', async () => {
      // Act
      const user = await User.findOne({ where: { email: 'nonexistent@example.com' } });

      // Assert
      expect(user).toBeNull();
    });
  });

  describe('User Updates', () => {
    it('should update user data', async () => {
      // Arrange
      const user = await User.create({
        name: 'Original Name',
        email: 'update@example.com',
        password: 'password123'
      });

      // Act
      await user.update({
        name: 'Updated Name',
        address: 'New Address'
      });

      // Assert
      expect(user.name).toBe('Updated Name');
      expect(user.address).toBe('New Address');
      expect(user.email).toBe('update@example.com'); // Should remain unchanged
    });

    it('should update user password', async () => {
      // Arrange
      const user = await User.create({
        name: 'Test User',
        email: 'password@example.com',
        password: 'oldpassword'
      });

      const newPassword = 'newpassword';

      // Act
      await user.update({ password: newPassword });

      // Assert
      expect(user.password).toBe(newPassword);
    });
  });

  describe('User Deletion', () => {
    it('should delete user', async () => {
      // Arrange
      const user = await User.create({
        name: 'Delete User',
        email: 'delete@example.com',
        password: 'password123'
      });

      const userId = user.id;

      // Act
      await user.destroy();

      // Assert
      const deletedUser = await User.findByPk(userId);
      expect(deletedUser).toBeNull();
    });
  });

  describe('User Instance Methods', () => {
    it('should convert user to JSON without password', async () => {
      // Arrange
      const user = await User.create({
        name: 'JSON User',
        email: 'json@example.com',
        password: 'password123'
      });

      // Act
      const userJson = user.toJSON();

      // Assert
      expect(userJson).toHaveProperty('id');
      expect(userJson).toHaveProperty('name');
      expect(userJson).toHaveProperty('email');
      expect(userJson).toHaveProperty('password'); // Password should still be there in toJSON
    });

    it('should handle user data serialization', async () => {
      // Arrange
      const user = await User.create({
        name: 'Serial User',
        email: 'serial@example.com',
        password: 'password123',
        address: 'Test Address',
        phoneNumber: '1234567890'
      });

      // Act
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        phoneNumber: user.phoneNumber,
        isAdmin: user.isAdmin
      };

      // Assert
      expect(userData).toHaveProperty('id');
      expect(userData).toHaveProperty('name');
      expect(userData).toHaveProperty('email');
      expect(userData).not.toHaveProperty('password');
      expect(userData).toHaveProperty('address');
      expect(userData).toHaveProperty('phoneNumber');
    });
  });
}); 