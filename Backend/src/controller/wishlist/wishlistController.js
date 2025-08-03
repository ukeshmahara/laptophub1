import { Wishlist, Laptop, User } from "../../models/index.js";

// Get user's wishlist
export const getUserWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const wishlistItems = await Wishlist.findAll({
      where: { userId },
      include: [{ model: Laptop }],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({ success: true, data: wishlistItems });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ success: false, message: 'Error fetching wishlist' });
  }
};

// Add item to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { userId, laptopId } = req.body;
    
    // Check if item already exists in wishlist
    const existingItem = await Wishlist.findOne({
      where: { userId, laptopId }
    });
    
    if (existingItem) {
      return res.status(400).json({ 
        success: false, 
        message: 'Item already exists in wishlist' 
      });
    }
    
    // Check if laptop exists
    const laptop = await Laptop.findByPk(laptopId);
    if (!laptop) {
      return res.status(404).json({ 
        success: false, 
        message: 'Laptop not found' 
      });
    }
    
    const wishlistItem = await Wishlist.create({ userId, laptopId });
    
    // Fetch the complete item with laptop details
    const completeItem = await Wishlist.findByPk(wishlistItem.id, {
      include: [{ model: Laptop }]
    });
    
    res.status(201).json({ 
      success: true, 
      data: completeItem, 
      message: 'Item added to wishlist successfully' 
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ success: false, message: 'Error adding to wishlist' });
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { userId, laptopId } = req.params;
    
    const wishlistItem = await Wishlist.findOne({
      where: { userId, laptopId }
    });
    
    if (!wishlistItem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found in wishlist' 
      });
    }
    
    await wishlistItem.destroy();
    res.status(200).json({ 
      success: true, 
      message: 'Item removed from wishlist successfully' 
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ success: false, message: 'Error removing from wishlist' });
  }
};

// Check if item is in wishlist
export const checkWishlistItem = async (req, res) => {
  try {
    const { userId, laptopId } = req.params;
    
    const wishlistItem = await Wishlist.findOne({
      where: { userId, laptopId }
    });
    
    res.status(200).json({ 
      success: true, 
      data: { isInWishlist: !!wishlistItem } 
    });
  } catch (error) {
    console.error('Error checking wishlist item:', error);
    res.status(500).json({ success: false, message: 'Error checking wishlist item' });
  }
}; 