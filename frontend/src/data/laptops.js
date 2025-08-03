const laptops = [
  {
    id: 1,
    name: "Lenovo IdeaPad 3",
    brand: "Lenovo",
    price: 45000,
    originalPrice: 55000,
    rating: 4.1,
    reviews: 334,
    image: "https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&w=400",
    specs: {
      processor: "AMD Ryzen 5 5500U",
      ram: "8GB",
      storage: "256GB SSD",
      display: "15.6\" FHD",
      os: "Windows 11 Home"
    },
    inStock: true,
    isNew: false,
    discount: 18
  },
  {
    id: 2,
    name: "HP Pavilion 15",
    brand: "HP",
    price: 52000,
    originalPrice: 65000,
    rating: 4.2,
    reviews: 423,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=compress&w=400",
    specs: {
      processor: "AMD Ryzen 5 5600H",
      ram: "8GB",
      storage: "256GB SSD",
      display: "15.6\" FHD",
      os: "Windows 11 Home"
    },
    inStock: true,
    isNew: false,
    discount: 20
  },
  {
    id: 3,
    name: "Dell Inspiron 15 300",
    brand: "Dell",
    price: 48000,
    originalPrice: 60000,
    rating: 4.2,
    reviews: 445,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=compress&w=400",
    specs: {
      processor: "Intel i3-1115G4",
      ram: "8GB",
      storage: "256GB SSD",
      display: "15.6\" HD",
      os: "Windows 11 Home"
    },
    inStock: true,
    isNew: false,
    discount: 20
  },
  {
    id: 4,
    name: "ASUS VivoBook S15",
    brand: "ASUS",
    price: 58000,
    originalPrice: 72000,
    rating: 4.3,
    reviews: 567,
    image: "https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg?auto=compress&w=400",
    specs: {
      processor: "Intel i5-1135G7",
      ram: "8GB",
      storage: "512GB SSD",
      display: "15.6\" FHD",
      os: "Windows 11 Home"
    },
    inStock: true,
    isNew: false,
    discount: 19
  },
  {
    id: 5,
    name: "Acer Swift 3",
    brand: "Acer",
    price: 55000,
    originalPrice: 68000,
    rating: 4.4,
    reviews: 389,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=compress&w=400",
    specs: {
      processor: "Intel i5-1135G7",
      ram: "8GB",
      storage: "512GB SSD",
      display: "14\" FHD",
      os: "Windows 11 Home"
    },
    inStock: true,
    isNew: false,
    discount: 19
  },
  {
    id: 6,
    name: "Lenovo IdeaPad 5",
    brand: "Lenovo",
    price: 65000,
    originalPrice: 78000,
    rating: 4.3,
    reviews: 456,
    image: "https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&w=400",
    specs: {
      processor: "AMD Ryzen 7 5700U",
      ram: "8GB",
      storage: "512GB SSD",
      display: "15.6\" FHD",
      os: "Windows 11 Home"
    },
    inStock: true,
    isNew: false,
    discount: 17
  },
  {
    id: 7,
    name: "HP 15s",
    brand: "HP",
    price: 42000,
    originalPrice: 52000,
    rating: 4.0,
    reviews: 289,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=compress&w=400",
    specs: {
      processor: "Intel i3-1215U",
      ram: "8GB",
      storage: "256GB SSD",
      display: "15.6\" FHD",
      os: "Windows 11 Home"
    },
    inStock: true,
    isNew: false,
    discount: 19
  },
  {
    id: 8,
    name: "Dell Vostro 15",
    brand: "Dell",
    price: 55000,
    originalPrice: 68000,
    rating: 4.2,
    reviews: 378,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=compress&w=400",
    specs: {
      processor: "Intel i5-1235U",
      ram: "8GB",
      storage: "512GB SSD",
      display: "15.6\" FHD",
      os: "Windows 11 Pro"
    },
    inStock: true,
    isNew: false,
    discount: 19
  },
  {
    id: 9,
    name: "ASUS TUF Gaming A15",
    brand: "ASUS",
    price: 85000,
    originalPrice: 98000,
    rating: 4.5,
    reviews: 567,
    image: "https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg?auto=compress&w=400",
    specs: {
      processor: "AMD Ryzen 5 5600H",
      ram: "8GB",
      storage: "512GB SSD",
      display: "15.6\" FHD 144Hz",
      os: "Windows 11 Home",
      gpu: "NVIDIA GTX 1650"
    },
    inStock: true,
    isNew: false,
    discount: 13
  },
  {
    id: 10,
    name: "Lenovo ThinkPad E14",
    brand: "Lenovo",
    price: 72000,
    originalPrice: 85000,
    rating: 4.4,
    reviews: 445,
    image: "https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&w=400",
    specs: {
      processor: "Intel i5-1235U",
      ram: "8GB",
      storage: "512GB SSD",
      display: "14\" FHD",
      os: "Windows 11 Pro"
    },
    inStock: true,
    isNew: false,
    discount: 15
  },
  {
    id: 11,
    name: "HP Envy x360 13",
    brand: "HP",
    price: 78000,
    originalPrice: 92000,
    rating: 4.3,
    reviews: 334,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=compress&w=400",
    specs: {
      processor: "AMD Ryzen 5 5600U",
      ram: "8GB",
      storage: "512GB SSD",
      display: "13.3\" FHD Touch",
      os: "Windows 11 Home"
    },
    inStock: true,
    isNew: false,
    discount: 15
  },
  {
    id: 12,
    name: "Acer Aspire 5",
    brand: "Acer",
    price: 48000,
    originalPrice: 58000,
    rating: 4.1,
    reviews: 298,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=compress&w=400",
    specs: {
      processor: "Intel i3-1215U",
      ram: "8GB",
      storage: "256GB SSD",
      display: "15.6\" FHD",
      os: "Windows 11 Home"
    },
    inStock: true,
    isNew: false,
    discount: 17
  },
  {
    id: 13,
    name: "Dell Latitude 3420",
    brand: "Dell",
    price: 68000,
    originalPrice: 80000,
    rating: 4.3,
    reviews: 412,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=compress&w=400",
    specs: {
      processor: "Intel i5-1135G7",
      ram: "8GB",
      storage: "512GB SSD",
      display: "14\" FHD",
      os: "Windows 11 Pro"
    },
    inStock: true,
    isNew: false,
    discount: 15
  },
  {
    id: 14,
    name: "Lenovo Legion 5",
    brand: "Lenovo",
    price: 95000,
    originalPrice: 110000,
    rating: 4.6,
    reviews: 678,
    image: "https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&w=400",
    specs: {
      processor: "AMD Ryzen 5 5600H",
      ram: "8GB",
      storage: "512GB SSD",
      display: "15.6\" FHD 120Hz",
      os: "Windows 11 Home",
      gpu: "NVIDIA RTX 3050"
    },
    inStock: true,
    isNew: false,
    discount: 14
  },
  {
    id: 15,
    name: "ASUS ZenBook 14",
    brand: "ASUS",
    price: 82000,
    originalPrice: 95000,
    rating: 4.5,
    reviews: 445,
    image: "https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg?auto=compress&w=400",
    specs: {
      processor: "Intel i5-1135G7",
      ram: "8GB",
      storage: "512GB SSD",
      display: "14\" FHD",
      os: "Windows 11 Home"
    },
    inStock: true,
    isNew: false,
    discount: 14
  },
  {
    id: 16,
    name: "HP ProBook 450",
    brand: "HP",
    price: 75000,
    originalPrice: 88000,
    rating: 4.3,
    reviews: 389,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=compress&w=400",
    specs: {
      processor: "Intel i5-1235U",
      ram: "8GB",
      storage: "512GB SSD",
      display: "15.6\" FHD",
      os: "Windows 11 Pro"
    },
    inStock: true,
    isNew: false,
    discount: 15
  },
  {
    id: 17,
    name: "Acer Nitro 5",
    brand: "Acer",
    price: 88000,
    originalPrice: 102000,
    rating: 4.4,
    reviews: 523,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=compress&w=400",
    specs: {
      processor: "Intel i5-11400H",
      ram: "8GB",
      storage: "512GB SSD",
      display: "15.6\" FHD 144Hz",
      os: "Windows 11 Home",
      gpu: "NVIDIA GTX 1650"
    },
    inStock: true,
    isNew: false,
    discount: 14
  },
  {
    id: 18,
    name: "Dell G15 Gaming",
    brand: "Dell",
    price: 92000,
    originalPrice: 108000,
    rating: 4.5,
    reviews: 567,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=compress&w=400",
    specs: {
      processor: "Intel i5-11400H",
      ram: "8GB",
      storage: "512GB SSD",
      display: "15.6\" FHD 120Hz",
      os: "Windows 11 Home",
      gpu: "NVIDIA RTX 3050"
    },
    inStock: true,
    isNew: false,
    discount: 15
  },
  {
    id: 19,
    name: "Lenovo Yoga 7",
    brand: "Lenovo",
    price: 68000,
    originalPrice: 80000,
    rating: 4.2,
    reviews: 334,
    image: "https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&w=400",
    specs: {
      processor: "AMD Ryzen 5 5500U",
      ram: "8GB",
      storage: "512GB SSD",
      display: "14\" FHD Touch",
      os: "Windows 11 Home"
    },
    inStock: true,
    isNew: false,
    discount: 15
  },
  {
    id: 20,
    name: "ASUS ExpertBook B1",
    brand: "ASUS",
    price: 72000,
    originalPrice: 85000,
    rating: 4.3,
    reviews: 445,
    image: "https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg?auto=compress&w=400",
    specs: {
      processor: "Intel i5-1135G7",
      ram: "8GB",
      storage: "512GB SSD",
      display: "15.6\" FHD",
      os: "Windows 11 Pro"
    },
    inStock: true,
    isNew: false,
    discount: 15
  },
  {
    id: 21,
    name: "HP Chromebook 14",
    brand: "HP",
    price: 35000,
    originalPrice: 42000,
    rating: 4.0,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=compress&w=400",
    specs: {
      processor: "Intel Celeron N4500",
      ram: "4GB",
      storage: "64GB eMMC",
      display: "14\" FHD",
      os: "Chrome OS"
    },
    inStock: true,
    isNew: false,
    discount: 17
  },
  {
    id: 22,
    name: "Lenovo Chromebook Flex 5",
    brand: "Lenovo",
    price: 42000,
    originalPrice: 50000,
    rating: 4.1,
    reviews: 189,
    image: "https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&w=400",
    specs: {
      processor: "Intel Core i3-10110U",
      ram: "4GB",
      storage: "128GB SSD",
      display: "13.3\" FHD Touch",
      os: "Chrome OS"
    },
    inStock: true,
    isNew: false,
    discount: 16
  },
  {
    id: 23,
    name: "Acer Chromebook 315",
    brand: "Acer",
    price: 32000,
    originalPrice: 38000,
    rating: 3.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=compress&w=400",
    specs: {
      processor: "Intel Celeron N4020",
      ram: "4GB",
      storage: "64GB eMMC",
      display: "15.6\" HD",
      os: "Chrome OS"
    },
    inStock: true,
    isNew: false,
    discount: 16
  },
  {
    id: 24,
    name: "Dell Inspiron 14 2-in-1",
    brand: "Dell",
    price: 65000,
    originalPrice: 78000,
    rating: 4.3,
    reviews: 378,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=compress&w=400",
    specs: {
      processor: "Intel i5-1135G7",
      ram: "8GB",
      storage: "512GB SSD",
      display: "14\" FHD Touch",
      os: "Windows 11 Home"
    },
    inStock: true,
    isNew: false,
    discount: 17
  }
];

export default laptops;
