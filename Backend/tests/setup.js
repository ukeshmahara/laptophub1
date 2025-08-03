import dotenv from 'dotenv';
import { sequelize } from '../src/database/index.js';

// Load environment variables
dotenv.config({ path: 'test.env' });

// Global test setup
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  
  // Connect to test database
  try {
    await sequelize.authenticate();
    console.log('Test database connected successfully.');
    
    // Import models to ensure they are registered
    await import('../src/models/index.js');
    
    // Sync models with test database
    await sequelize.sync({ force: true });
    console.log('Test database models synchronized.');
  } catch (error) {
    console.error('Test database connection failed:', error);
  }
});

// Global test teardown
afterAll(async () => {
  try {
    await sequelize.close();
    console.log('Test database connection closed.');
  } catch (error) {
    console.error('Error closing test database connection:', error);
  }
});

// Clean up after each test
afterEach(async () => {
  // Clear all tables after each test
  const models = sequelize.models;
  for (const modelName in models) {
    await models[modelName].destroy({ 
      where: {},
      force: true,
      truncate: true 
    });
  }
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
}; 