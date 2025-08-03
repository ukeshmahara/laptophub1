import { 
  getAllLaptops, 
  getLaptopById, 
  createLaptop, 
  updateLaptop, 
  deleteLaptop,
  searchLaptops 
} from '../../src/controller/laptop/laptopController.js';
import { Laptop } from '../../src/models/index.js';
import { 
  createMockRequest, 
  createMockResponse, 
  createMockNext,
  validateResponseStructure,
  validateErrorResponse
} from '../utils/testUtils.js';

describe('Laptop Controller', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    mockNext = createMockNext();
  });

  describe('getAllLaptops', () => {
    it('should return all laptops successfully', async () => {
      // Arrange
      const mockLaptops = [
        {
          id: 1,
          name: 'MacBook Pro',
          brand: 'Apple',
          price: 1299,
          originalPrice: 1499,
          image: 'macbook.jpg',
          processor: 'M2',
          ram: '8GB',
          storage: '256GB SSD',
          display: '13.3 inch',
          os: 'macOS'
        },
        {
          id: 2,
          name: 'ThinkPad X1',
          brand: 'Lenovo',
          price: 1199,
          originalPrice: 1399,
          image: 'thinkpad.jpg',
          processor: 'Intel i7',
          ram: '16GB',
          storage: '512GB SSD',
          display: '14 inch',
          os: 'Windows 11'
        }
      ];

      jest.spyOn(Laptop, 'findAll').mockResolvedValue(mockLaptops);

      // Act
      await getAllLaptops(mockReq, mockRes);

      // Assert
      const responseData = validateResponseStructure(mockRes, 200);
      expect(responseData.success).toBe(true);
      expect(responseData.data).toEqual(mockLaptops);
      expect(Laptop.findAll).toHaveBeenCalledWith({
        order: [['createdAt', 'DESC']]
      });
    });

    it('should handle database errors when fetching laptops', async () => {
      // Arrange
      jest.spyOn(Laptop, 'findAll').mockRejectedValue(new Error('Database error'));

      // Act
      await getAllLaptops(mockReq, mockRes);

      // Assert
      const responseData = validateErrorResponse(mockRes, 500);
      expect(responseData.message).toBe('Error fetching laptops');
    });
  });

  describe('getLaptopById', () => {
    it('should return laptop by ID successfully', async () => {
      // Arrange
      const mockLaptop = {
        id: 1,
        name: 'MacBook Pro',
        brand: 'Apple',
        price: 1299,
        originalPrice: 1499,
        image: 'macbook.jpg',
        processor: 'M2',
        ram: '8GB',
        storage: '256GB SSD',
        display: '13.3 inch',
        os: 'macOS'
      };

      mockReq.params = { id: '1' };
      jest.spyOn(Laptop, 'findByPk').mockResolvedValue(mockLaptop);

      // Act
      await getLaptopById(mockReq, mockRes);

      // Assert
      const responseData = validateResponseStructure(mockRes, 200);
      expect(responseData.success).toBe(true);
      expect(responseData.data).toEqual(mockLaptop);
      expect(Laptop.findByPk).toHaveBeenCalledWith('1');
    });

    it('should return 404 when laptop is not found', async () => {
      // Arrange
      mockReq.params = { id: '999' };
      jest.spyOn(Laptop, 'findByPk').mockResolvedValue(null);

      // Act
      await getLaptopById(mockReq, mockRes);

      // Assert
      const responseData = validateErrorResponse(mockRes, 404);
      expect(responseData.message).toBe('Laptop not found');
    });

    it('should handle database errors when fetching laptop by ID', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      jest.spyOn(Laptop, 'findByPk').mockRejectedValue(new Error('Database error'));

      // Act
      await getLaptopById(mockReq, mockRes);

      // Assert
      const responseData = validateErrorResponse(mockRes, 500);
      expect(responseData.message).toBe('Error fetching laptop');
    });
  });

  describe('createLaptop', () => {
    it('should create laptop successfully', async () => {
      // Arrange
      const laptopData = {
        name: 'MacBook Pro',
        brand: 'Apple',
        price: 1299,
        originalPrice: 1499,
        image: 'macbook.jpg',
        processor: 'M2',
        ram: '8GB',
        storage: '256GB SSD',
        display: '13.3 inch',
        os: 'macOS'
      };

      const createdLaptop = { id: 1, ...laptopData, discount: 13 };
      mockReq.body = laptopData;
      jest.spyOn(Laptop, 'create').mockResolvedValue(createdLaptop);

      // Act
      await createLaptop(mockReq, mockRes);

      // Assert
      const responseData = validateResponseStructure(mockRes, 201);
      expect(responseData.success).toBe(true);
      expect(responseData.data).toEqual(createdLaptop);
      expect(responseData.message).toBe('Laptop created successfully');
      expect(Laptop.create).toHaveBeenCalledWith({
        ...laptopData,
        discount: 13
      });
    });

    it('should calculate discount correctly', async () => {
      // Arrange
      const laptopData = {
        name: 'MacBook Pro',
        brand: 'Apple',
        price: 1200,
        originalPrice: 1500,
        image: 'macbook.jpg',
        processor: 'M2',
        ram: '8GB',
        storage: '256GB SSD',
        display: '13.3 inch',
        os: 'macOS'
      };

      const createdLaptop = { id: 1, ...laptopData, discount: 20 };
      mockReq.body = laptopData;
      jest.spyOn(Laptop, 'create').mockResolvedValue(createdLaptop);

      // Act
      await createLaptop(mockReq, mockRes);

      // Assert
      expect(Laptop.create).toHaveBeenCalledWith({
        ...laptopData,
        discount: 20 // (1500-1200)/1500 * 100 = 20
      });
    });

    it('should handle database errors when creating laptop', async () => {
      // Arrange
      mockReq.body = {
        name: 'MacBook Pro',
        brand: 'Apple',
        price: 1299,
        originalPrice: 1499,
        image: 'macbook.jpg',
        processor: 'M2',
        ram: '8GB',
        storage: '256GB SSD',
        display: '13.3 inch',
        os: 'macOS'
      };

      jest.spyOn(Laptop, 'create').mockRejectedValue(new Error('Database error'));

      // Act
      await createLaptop(mockReq, mockRes);

      // Assert
      const responseData = validateErrorResponse(mockRes, 500);
      expect(responseData.message).toBe('Error creating laptop');
    });
  });

  describe('updateLaptop', () => {
    it('should update laptop successfully', async () => {
      // Arrange
      const existingLaptop = {
        id: 1,
        name: 'MacBook Pro',
        brand: 'Apple',
        price: 1299,
        originalPrice: 1499,
        image: 'macbook.jpg',
        processor: 'M2',
        ram: '8GB',
        storage: '256GB SSD',
        display: '13.3 inch',
        os: 'macOS',
        update: jest.fn().mockResolvedValue(true)
      };

      const updateData = {
        name: 'MacBook Pro Updated',
        price: 1199,
        originalPrice: 1499
      };

      mockReq.params = { id: '1' };
      mockReq.body = updateData;
      jest.spyOn(Laptop, 'findByPk').mockResolvedValue(existingLaptop);

      // Act
      await updateLaptop(mockReq, mockRes);

      // Assert
      const responseData = validateResponseStructure(mockRes, 200);
      expect(responseData.success).toBe(true);
      expect(responseData.message).toBe('Laptop updated successfully');
      expect(existingLaptop.update).toHaveBeenCalledWith({
        ...updateData,
        discount: 20 // (1499-1199)/1499 * 100 = 20
      });
    });

    it('should return 404 when laptop to update is not found', async () => {
      // Arrange
      mockReq.params = { id: '999' };
      mockReq.body = { name: 'Updated Name' };
      jest.spyOn(Laptop, 'findByPk').mockResolvedValue(null);

      // Act
      await updateLaptop(mockReq, mockRes);

      // Assert
      const responseData = validateErrorResponse(mockRes, 404);
      expect(responseData.message).toBe('Laptop not found');
    });

    it('should handle database errors when updating laptop', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Updated Name' };
      jest.spyOn(Laptop, 'findByPk').mockRejectedValue(new Error('Database error'));

      // Act
      await updateLaptop(mockReq, mockRes);

      // Assert
      const responseData = validateErrorResponse(mockRes, 500);
      expect(responseData.message).toBe('Error updating laptop');
    });
  });

  describe('deleteLaptop', () => {
    it('should delete laptop successfully', async () => {
      // Arrange
      const existingLaptop = {
        id: 1,
        name: 'MacBook Pro',
        brand: 'Apple',
        destroy: jest.fn().mockResolvedValue(true)
      };

      mockReq.params = { id: '1' };
      jest.spyOn(Laptop, 'findByPk').mockResolvedValue(existingLaptop);

      // Act
      await deleteLaptop(mockReq, mockRes);

      // Assert
      const responseData = validateResponseStructure(mockRes, 200);
      expect(responseData.success).toBe(true);
      expect(responseData.message).toBe('Laptop deleted successfully');
      expect(existingLaptop.destroy).toHaveBeenCalled();
    });

    it('should return 404 when laptop to delete is not found', async () => {
      // Arrange
      mockReq.params = { id: '999' };
      jest.spyOn(Laptop, 'findByPk').mockResolvedValue(null);

      // Act
      await deleteLaptop(mockReq, mockRes);

      // Assert
      const responseData = validateErrorResponse(mockRes, 404);
      expect(responseData.message).toBe('Laptop not found');
    });

    it('should handle database errors when deleting laptop', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      jest.spyOn(Laptop, 'findByPk').mockRejectedValue(new Error('Database error'));

      // Act
      await deleteLaptop(mockReq, mockRes);

      // Assert
      const responseData = validateErrorResponse(mockRes, 500);
      expect(responseData.message).toBe('Error deleting laptop');
    });
  });

  describe('searchLaptops', () => {
    it('should search laptops successfully', async () => {
      // Arrange
      const mockLaptops = [
        {
          id: 1,
          name: 'MacBook Pro',
          brand: 'Apple',
          processor: 'M2'
        }
      ];

      mockReq.query = { query: 'MacBook' };
      jest.spyOn(Laptop, 'findAll').mockResolvedValue(mockLaptops);

      // Act
      await searchLaptops(mockReq, mockRes);

      // Assert
      const responseData = validateResponseStructure(mockRes, 200);
      expect(responseData.success).toBe(true);
      expect(responseData.data).toEqual(mockLaptops);
    });

    it('should return 400 when search query is missing', async () => {
      // Arrange
      mockReq.query = {};

      // Act
      await searchLaptops(mockReq, mockRes);

      // Assert
      const responseData = validateErrorResponse(mockRes, 400);
      expect(responseData.message).toBe('Search query is required');
    });

    it('should handle database errors when searching laptops', async () => {
      // Arrange
      mockReq.query = { query: 'MacBook' };
      jest.spyOn(Laptop, 'findAll').mockRejectedValue(new Error('Database error'));

      // Act
      await searchLaptops(mockReq, mockRes);

      // Assert
      const responseData = validateErrorResponse(mockRes, 500);
      expect(responseData.message).toBe('Error searching laptops');
    });
  });
}); 