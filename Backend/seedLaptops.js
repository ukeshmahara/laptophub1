import { sequelize } from './src/database/index.js';
import { Laptop } from './src/models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleLaptops = [
  {
    name: "Lenovo IdeaPad 3",
    brand: "Lenovo",
    price: 45000,
    originalPrice: 55000,
    image: "https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&w=400",
    description: "Perfect for everyday computing with reliable performance",
    processor: "AMD Ryzen 5 5500U",
    ram: "8GB",
    storage: "256GB SSD",
    display: "15.6\" FHD",
    os: "Windows 11 Home",
    inStock: true,
    isNew: false,
    rating: 4.1,
    reviews: 334,
    discount: 18
  },
  {
    name: "HP Pavilion 15",
    brand: "HP",
    price: 52000,
    originalPrice: 65000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=compress&w=400",
    description: "Stylish design with powerful performance for work and entertainment",
    processor: "AMD Ryzen 5 5600H",
    ram: "8GB",
    storage: "256GB SSD",
    display: "15.6\" FHD",
    os: "Windows 11 Home",
    inStock: true,
    isNew: false,
    rating: 4.2,
    reviews: 423,
    discount: 20
  },
  {
    name: "Dell Inspiron 15 300",
    brand: "Dell",
    price: 48000,
    originalPrice: 60000,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=compress&w=400",
    description: "Reliable performance for students and professionals",
    processor: "Intel i3-1115G4",
    ram: "8GB",
    storage: "256GB SSD",
    display: "15.6\" HD",
    os: "Windows 11 Home",
    inStock: true,
    isNew: false,
    rating: 4.2,
    reviews: 445,
    discount: 20
  },
  {
    name: "ASUS VivoBook S15",
    brand: "ASUS",
    price: 58000,
    originalPrice: 72000,
    image: "https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg?auto=compress&w=400",
    description: "Slim and lightweight with premium features",
    processor: "Intel i5-1135G7",
    ram: "8GB",
    storage: "512GB SSD",
    display: "15.6\" FHD",
    os: "Windows 11 Home",
    inStock: true,
    isNew: false,
    rating: 4.3,
    reviews: 567,
    discount: 19
  },
  {
    name: "Acer Swift 3",
    brand: "Acer",
    price: 55000,
    originalPrice: 68000,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=compress&w=400",
    description: "Ultra-portable with all-day battery life",
    processor: "Intel i5-1135G7",
    ram: "8GB",
    storage: "512GB SSD",
    display: "14\" FHD",
    os: "Windows 11 Home",
    inStock: true,
    isNew: false,
    rating: 4.4,
    reviews: 389,
    discount: 19
  },
  {
    name: "MacBook Air M1",
    brand: "Apple",
    price: 120000,
    originalPrice: 140000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=compress&w=400",
    description: "Revolutionary performance with Apple Silicon",
    processor: "Apple M1",
    ram: "8GB",
    storage: "256GB SSD",
    display: "13.3\" Retina",
    os: "macOS",
    inStock: true,
    isNew: true,
    rating: 4.8,
    reviews: 892,
    discount: 14
  },
  {
    name: "MSI Gaming Laptop",
    brand: "MSI",
    price: 85000,
    originalPrice: 95000,
    image: "https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&w=400",
    description: "High-performance gaming laptop with RGB lighting",
    processor: "Intel i5-11400H",
    ram: "16GB",
    storage: "512GB SSD",
    display: "15.6\" FHD 144Hz",
    os: "Windows 11 Home",
    inStock: true,
    isNew: false,
    rating: 4.5,
    reviews: 234,
    discount: 11
  },
  {
    name: "Razer Blade 15",
    brand: "Razer",
    price: 180000,
    originalPrice: 200000,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=compress&w=400",
    description: "Premium gaming laptop with exceptional build quality",
    processor: "Intel i7-11800H",
    ram: "16GB",
    storage: "1TB SSD",
    display: "15.6\" QHD 165Hz",
    os: "Windows 11 Home",
    inStock: true,
    isNew: true,
    rating: 4.7,
    reviews: 156,
    discount: 10
  }
];

const seedLaptops = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Import models to ensure they are registered
    await import('./src/models/index.js');

    // Sync models
    await sequelize.sync({ force: true });
    console.log('Database synchronized.');

    // Clear existing data
    await Laptop.destroy({ where: {} });
    console.log('Existing laptop data cleared.');

    // Insert sample data
    const createdLaptops = await Laptop.bulkCreate(sampleLaptops);
    console.log(`Successfully seeded ${createdLaptops.length} laptops.`);

    // Display created laptops
    createdLaptops.forEach(laptop => {
      console.log(`- ${laptop.name} (${laptop.brand}) - NPR ${laptop.price.toLocaleString()}`);
    });

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
};

// Run the seeding function
seedLaptops(); 