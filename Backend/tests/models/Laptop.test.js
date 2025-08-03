import { Laptop } from '../../src/models/index.js';

describe('Laptop Model', () => {
  describe('Laptop Creation', () => {
    it('should create a laptop with valid data', async () => {
      // Arrange
      const laptopData = {
        name: 'MacBook Pro',
        brand: 'Apple',
        price: 1299,
        originalPrice: 1499,
        image: 'macbook.jpg',
        description: 'Powerful laptop for professionals',
        processor: 'M2',
        ram: '8GB',
        storage: '256GB SSD',
        display: '13.3 inch',
        os: 'macOS',
        inStock: true,
        isNew: true,
        rating: 4.5,
        reviews: 120,
        discount: 13
      };

      // Act
      const laptop = await Laptop.create(laptopData);

      // Assert
      expect(laptop).toBeDefined();
      expect(laptop.id).toBeDefined();
      expect(laptop.name).toBe(laptopData.name);
      expect(laptop.brand).toBe(laptopData.brand);
      expect(laptop.price).toBe(laptopData.price);
      expect(laptop.originalPrice).toBe(laptopData.originalPrice);
      expect(laptop.image).toBe(laptopData.image);
      expect(laptop.description).toBe(laptopData.description);
      expect(laptop.processor).toBe(laptopData.processor);
      expect(laptop.ram).toBe(laptopData.ram);
      expect(laptop.storage).toBe(laptopData.storage);
      expect(laptop.display).toBe(laptopData.display);
      expect(laptop.os).toBe(laptopData.os);
      expect(laptop.inStock).toBe(laptopData.inStock);
      expect(laptop.isNew).toBe(laptopData.isNew);
      expect(laptop.rating).toBe(laptopData.rating);
      expect(laptop.reviews).toBe(laptopData.reviews);
      expect(laptop.discount).toBe(laptopData.discount);
      expect(laptop.createdAt).toBeDefined();
      expect(laptop.updatedAt).toBeDefined();
    });

    it('should create a laptop with minimal required data', async () => {
      // Arrange
      const laptopData = {
        name: 'Minimal Laptop',
        brand: 'Generic',
        price: 999,
        originalPrice: 999,
        image: 'laptop.jpg',
        processor: 'Intel i5',
        ram: '8GB',
        storage: '256GB SSD',
        display: '15.6 inch',
        os: 'Windows 11'
      };

      // Act
      const laptop = await Laptop.create(laptopData);

      // Assert
      expect(laptop).toBeDefined();
      expect(laptop.name).toBe(laptopData.name);
      expect(laptop.brand).toBe(laptopData.brand);
      expect(laptop.price).toBe(laptopData.price);
      expect(laptop.originalPrice).toBe(laptopData.originalPrice);
      expect(laptop.image).toBe(laptopData.image);
      expect(laptop.processor).toBe(laptopData.processor);
      expect(laptop.ram).toBe(laptopData.ram);
      expect(laptop.storage).toBe(laptopData.storage);
      expect(laptop.display).toBe(laptopData.display);
      expect(laptop.os).toBe(laptopData.os);
      expect(laptop.inStock).toBe(true); // Default value
      expect(laptop.isNew).toBe(false); // Default value
      expect(laptop.rating).toBe(4.0); // Default value
      expect(laptop.reviews).toBe(0); // Default value
      expect(laptop.discount).toBe(0); // Default value
      expect(laptop.description).toBeNull(); // Optional field
    });

    it('should not create a laptop without required fields', async () => {
      // Arrange
      const laptopData = {
        name: 'Test Laptop'
        // Missing required fields
      };

      // Act & Assert
      await expect(Laptop.create(laptopData)).rejects.toThrow();
    });

    it('should not create a laptop with invalid price', async () => {
      // Arrange
      const laptopData = {
        name: 'Test Laptop',
        brand: 'Test Brand',
        price: -100, // Invalid negative price
        originalPrice: 999,
        image: 'test.jpg',
        processor: 'Intel i5',
        ram: '8GB',
        storage: '256GB SSD',
        display: '15.6 inch',
        os: 'Windows 11'
      };

      // Act & Assert
      await expect(Laptop.create(laptopData)).rejects.toThrow();
    });
  });

  describe('Laptop Validation', () => {
    it('should require non-empty name', async () => {
      // Arrange
      const laptopData = {
        name: '',
        brand: 'Test Brand',
        price: 999,
        originalPrice: 999,
        image: 'test.jpg',
        processor: 'Intel i5',
        ram: '8GB',
        storage: '256GB SSD',
        display: '15.6 inch',
        os: 'Windows 11'
      };

      // Act & Assert
      await expect(Laptop.create(laptopData)).rejects.toThrow();
    });

    it('should require non-empty brand', async () => {
      // Arrange
      const laptopData = {
        name: 'Test Laptop',
        brand: '',
        price: 999,
        originalPrice: 999,
        image: 'test.jpg',
        processor: 'Intel i5',
        ram: '8GB',
        storage: '256GB SSD',
        display: '15.6 inch',
        os: 'Windows 11'
      };

      // Act & Assert
      await expect(Laptop.create(laptopData)).rejects.toThrow();
    });

    it('should require non-empty image', async () => {
      // Arrange
      const laptopData = {
        name: 'Test Laptop',
        brand: 'Test Brand',
        price: 999,
        originalPrice: 999,
        image: '',
        processor: 'Intel i5',
        ram: '8GB',
        storage: '256GB SSD',
        display: '15.6 inch',
        os: 'Windows 11'
      };

      // Act & Assert
      await expect(Laptop.create(laptopData)).rejects.toThrow();
    });

    it('should require non-empty processor', async () => {
      // Arrange
      const laptopData = {
        name: 'Test Laptop',
        brand: 'Test Brand',
        price: 999,
        originalPrice: 999,
        image: 'test.jpg',
        processor: '',
        ram: '8GB',
        storage: '256GB SSD',
        display: '15.6 inch',
        os: 'Windows 11'
      };

      // Act & Assert
      await expect(Laptop.create(laptopData)).rejects.toThrow();
    });

    it('should require non-empty ram', async () => {
      // Arrange
      const laptopData = {
        name: 'Test Laptop',
        brand: 'Test Brand',
        price: 999,
        originalPrice: 999,
        image: 'test.jpg',
        processor: 'Intel i5',
        ram: '',
        storage: '256GB SSD',
        display: '15.6 inch',
        os: 'Windows 11'
      };

      // Act & Assert
      await expect(Laptop.create(laptopData)).rejects.toThrow();
    });

    it('should require non-empty storage', async () => {
      // Arrange
      const laptopData = {
        name: 'Test Laptop',
        brand: 'Test Brand',
        price: 999,
        originalPrice: 999,
        image: 'test.jpg',
        processor: 'Intel i5',
        ram: '8GB',
        storage: '',
        display: '15.6 inch',
        os: 'Windows 11'
      };

      // Act & Assert
      await expect(Laptop.create(laptopData)).rejects.toThrow();
    });

    it('should require non-empty display', async () => {
      // Arrange
      const laptopData = {
        name: 'Test Laptop',
        brand: 'Test Brand',
        price: 999,
        originalPrice: 999,
        image: 'test.jpg',
        processor: 'Intel i5',
        ram: '8GB',
        storage: '256GB SSD',
        display: '',
        os: 'Windows 11'
      };

      // Act & Assert
      await expect(Laptop.create(laptopData)).rejects.toThrow();
    });

    it('should require non-empty os', async () => {
      // Arrange
      const laptopData = {
        name: 'Test Laptop',
        brand: 'Test Brand',
        price: 999,
        originalPrice: 999,
        image: 'test.jpg',
        processor: 'Intel i5',
        ram: '8GB',
        storage: '256GB SSD',
        display: '15.6 inch',
        os: ''
      };

      // Act & Assert
      await expect(Laptop.create(laptopData)).rejects.toThrow();
    });
  });

  describe('Laptop Queries', () => {
    beforeEach(async () => {
      // Create test laptops
      await Laptop.create({
        name: 'Laptop 1',
        brand: 'Brand A',
        price: 999,
        originalPrice: 1199,
        image: 'laptop1.jpg',
        processor: 'Intel i5',
        ram: '8GB',
        storage: '256GB SSD',
        display: '15.6 inch',
        os: 'Windows 11',
        inStock: true,
        isNew: true
      });

      await Laptop.create({
        name: 'Laptop 2',
        brand: 'Brand B',
        price: 1499,
        originalPrice: 1699,
        image: 'laptop2.jpg',
        processor: 'Intel i7',
        ram: '16GB',
        storage: '512GB SSD',
        display: '14 inch',
        os: 'Windows 11',
        inStock: false,
        isNew: false
      });

      await Laptop.create({
        name: 'Laptop 3',
        brand: 'Brand A',
        price: 799,
        originalPrice: 899,
        image: 'laptop3.jpg',
        processor: 'AMD Ryzen 5',
        ram: '8GB',
        storage: '256GB SSD',
        display: '15.6 inch',
        os: 'Windows 10',
        inStock: true,
        isNew: false
      });
    });

    it('should find laptop by primary key', async () => {
      // Arrange
      const createdLaptop = await Laptop.create({
        name: 'Test Laptop',
        brand: 'Test Brand',
        price: 999,
        originalPrice: 999,
        image: 'test.jpg',
        processor: 'Intel i5',
        ram: '8GB',
        storage: '256GB SSD',
        display: '15.6 inch',
        os: 'Windows 11'
      });

      // Act
      const laptop = await Laptop.findByPk(createdLaptop.id);

      // Assert
      expect(laptop).toBeDefined();
      expect(laptop.id).toBe(createdLaptop.id);
      expect(laptop.name).toBe('Test Laptop');
    });

    it('should find all laptops', async () => {
      // Act
      const laptops = await Laptop.findAll();

      // Assert
      expect(laptops).toBeDefined();
      expect(laptops.length).toBeGreaterThanOrEqual(3);
    });

    it('should find laptops with specific conditions', async () => {
      // Act
      const inStockLaptops = await Laptop.findAll({ where: { inStock: true } });

      // Assert
      expect(inStockLaptops).toBeDefined();
      expect(inStockLaptops.length).toBe(2);
      expect(inStockLaptops.every(laptop => laptop.inStock)).toBe(true);
    });

    it('should find laptops by brand', async () => {
      // Act
      const brandALaptops = await Laptop.findAll({ where: { brand: 'Brand A' } });

      // Assert
      expect(brandALaptops).toBeDefined();
      expect(brandALaptops.length).toBe(2);
      expect(brandALaptops.every(laptop => laptop.brand === 'Brand A')).toBe(true);
    });

    it('should find new laptops', async () => {
      // Act
      const newLaptops = await Laptop.findAll({ where: { isNew: true } });

      // Assert
      expect(newLaptops).toBeDefined();
      expect(newLaptops.length).toBe(1);
      expect(newLaptops[0].isNew).toBe(true);
    });

    it('should return null when laptop not found', async () => {
      // Act
      const laptop = await Laptop.findByPk(99999);

      // Assert
      expect(laptop).toBeNull();
    });
  });

  describe('Laptop Updates', () => {
    it('should update laptop data', async () => {
      // Arrange
      const laptop = await Laptop.create({
        name: 'Original Name',
        brand: 'Original Brand',
        price: 999,
        originalPrice: 999,
        image: 'original.jpg',
        processor: 'Intel i5',
        ram: '8GB',
        storage: '256GB SSD',
        display: '15.6 inch',
        os: 'Windows 11'
      });

      // Act
      await laptop.update({
        name: 'Updated Name',
        price: 1099,
        originalPrice: 1299,
        description: 'Updated description'
      });

      // Assert
      expect(laptop.name).toBe('Updated Name');
      expect(laptop.price).toBe(1099);
      expect(laptop.originalPrice).toBe(1299);
      expect(laptop.description).toBe('Updated description');
      expect(laptop.brand).toBe('Original Brand'); // Should remain unchanged
      expect(laptop.discount).toBe(15); // (1299-1099)/1299 * 100 = 15
    });

    it('should update laptop price and recalculate discount', async () => {
      // Arrange
      const laptop = await Laptop.create({
        name: 'Test Laptop',
        brand: 'Test Brand',
        price: 1000,
        originalPrice: 1200,
        image: 'test.jpg',
        processor: 'Intel i5',
        ram: '8GB',
        storage: '256GB SSD',
        display: '15.6 inch',
        os: 'Windows 11'
      });

      // Act
      await laptop.update({
        price: 900,
        originalPrice: 1200
      });

      // Assert
      expect(laptop.price).toBe(900);
      expect(laptop.originalPrice).toBe(1200);
      expect(laptop.discount).toBe(25); // (1200-900)/1200 * 100 = 25
    });

    it('should update laptop stock status', async () => {
      // Arrange
      const laptop = await Laptop.create({
        name: 'Test Laptop',
        brand: 'Test Brand',
        price: 999,
        originalPrice: 999,
        image: 'test.jpg',
        processor: 'Intel i5',
        ram: '8GB',
        storage: '256GB SSD',
        display: '15.6 inch',
        os: 'Windows 11',
        inStock: true
      });

      // Act
      await laptop.update({ inStock: false });

      // Assert
      expect(laptop.inStock).toBe(false);
    });
  });

  describe('Laptop Deletion', () => {
    it('should delete laptop', async () => {
      // Arrange
      const laptop = await Laptop.create({
        name: 'Delete Laptop',
        brand: 'Delete Brand',
        price: 999,
        originalPrice: 999,
        image: 'delete.jpg',
        processor: 'Intel i5',
        ram: '8GB',
        storage: '256GB SSD',
        display: '15.6 inch',
        os: 'Windows 11'
      });

      const laptopId = laptop.id;

      // Act
      await laptop.destroy();

      // Assert
      const deletedLaptop = await Laptop.findByPk(laptopId);
      expect(deletedLaptop).toBeNull();
    });
  });

  describe('Laptop Instance Methods', () => {
    it('should convert laptop to JSON', async () => {
      // Arrange
      const laptop = await Laptop.create({
        name: 'JSON Laptop',
        brand: 'JSON Brand',
        price: 999,
        originalPrice: 999,
        image: 'json.jpg',
        processor: 'Intel i5',
        ram: '8GB',
        storage: '256GB SSD',
        display: '15.6 inch',
        os: 'Windows 11'
      });

      // Act
      const laptopJson = laptop.toJSON();

      // Assert
      expect(laptopJson).toHaveProperty('id');
      expect(laptopJson).toHaveProperty('name');
      expect(laptopJson).toHaveProperty('brand');
      expect(laptopJson).toHaveProperty('price');
      expect(laptopJson).toHaveProperty('originalPrice');
      expect(laptopJson).toHaveProperty('image');
      expect(laptopJson).toHaveProperty('processor');
      expect(laptopJson).toHaveProperty('ram');
      expect(laptopJson).toHaveProperty('storage');
      expect(laptopJson).toHaveProperty('display');
      expect(laptopJson).toHaveProperty('os');
      expect(laptopJson).toHaveProperty('inStock');
      expect(laptopJson).toHaveProperty('isNew');
      expect(laptopJson).toHaveProperty('rating');
      expect(laptopJson).toHaveProperty('reviews');
      expect(laptopJson).toHaveProperty('discount');
      expect(laptopJson).toHaveProperty('createdAt');
      expect(laptopJson).toHaveProperty('updatedAt');
    });
  });
}); 