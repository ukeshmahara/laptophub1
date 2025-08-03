import { Laptop } from "../../models/index.js";

// Get all laptops
export const getAllLaptops = async (req, res) => {
  try {
    const laptops = await Laptop.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, data: laptops });
  } catch (error) {
    console.error('Error fetching laptops:', error);
    res.status(500).json({ success: false, message: 'Error fetching laptops' });
  }
};

// Get laptop by ID
export const getLaptopById = async (req, res) => {
  try {
    const { id } = req.params;
    const laptop = await Laptop.findByPk(id);
    
    if (!laptop) {
      return res.status(404).json({ success: false, message: 'Laptop not found' });
    }
    
    res.status(200).json({ success: true, data: laptop });
  } catch (error) {
    console.error('Error fetching laptop:', error);
    res.status(500).json({ success: false, message: 'Error fetching laptop' });
  }
};

// Create new laptop
export const createLaptop = async (req, res) => {
  try {
    const laptopData = req.body;
    
    // Calculate discount
    if (laptopData.originalPrice && laptopData.price) {
      laptopData.discount = Math.round(((laptopData.originalPrice - laptopData.price) / laptopData.originalPrice) * 100);
    }
    
    const laptop = await Laptop.create(laptopData);
    res.status(201).json({ success: true, data: laptop, message: 'Laptop created successfully' });
  } catch (error) {
    console.error('Error creating laptop:', error);
    res.status(500).json({ success: false, message: 'Error creating laptop' });
  }
};

// Update laptop
export const updateLaptop = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const laptop = await Laptop.findByPk(id);
    if (!laptop) {
      return res.status(404).json({ success: false, message: 'Laptop not found' });
    }
    
    // Calculate discount if prices are updated
    if (updateData.originalPrice && updateData.price) {
      updateData.discount = Math.round(((updateData.originalPrice - updateData.price) / updateData.originalPrice) * 100);
    }
    
    await laptop.update(updateData);
    res.status(200).json({ success: true, data: laptop, message: 'Laptop updated successfully' });
  } catch (error) {
    console.error('Error updating laptop:', error);
    res.status(500).json({ success: false, message: 'Error updating laptop' });
  }
};

// Delete laptop
export const deleteLaptop = async (req, res) => {
  try {
    const { id } = req.params;
    const laptop = await Laptop.findByPk(id);
    
    if (!laptop) {
      return res.status(404).json({ success: false, message: 'Laptop not found' });
    }
    
    await laptop.destroy();
    res.status(200).json({ success: true, message: 'Laptop deleted successfully' });
  } catch (error) {
    console.error('Error deleting laptop:', error);
    res.status(500).json({ success: false, message: 'Error deleting laptop' });
  }
};

// Search laptops
export const searchLaptops = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }
    
    const laptops = await Laptop.findAll({
      where: {
        [sequelize.Op.or]: [
          { name: { [sequelize.Op.iLike]: `%${query}%` } },
          { brand: { [sequelize.Op.iLike]: `%${query}%` } },
          { processor: { [sequelize.Op.iLike]: `%${query}%` } }
        ]
      },
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({ success: true, data: laptops });
  } catch (error) {
    console.error('Error searching laptops:', error);
    res.status(500).json({ success: false, message: 'Error searching laptops' });
  }
}; 