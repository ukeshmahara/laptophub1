import { Order, OrderItem, User, Laptop } from "../../models/index.js";
import { sequelize } from "../../database/index.js";

// Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          include: [{ model: Laptop }]
        },
        { model: User, attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Error fetching orders' });
  }
};

// Get orders by user ID
export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          include: [{ model: Laptop }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ success: false, message: 'Error fetching user orders' });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          include: [{ model: Laptop }]
        },
        { model: User, attributes: ['id', 'name', 'email'] }
      ]
    });
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Error fetching order' });
  }
};

// Create new order
export const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const orderData = req.body;
    const { items, ...orderInfo } = orderData;
    
    // Create order
    const order = await Order.create(orderInfo, { transaction });
    
    // Create order items
    const orderItems = await Promise.all(
      items.map(item => 
        OrderItem.create({
          orderId: order.id,
          laptopId: item.laptopId,
          laptopName: item.laptopName,
          laptopImage: item.laptopImage,
          quantity: item.quantity,
          price: item.price
        }, { transaction })
      )
    );
    
    await transaction.commit();
    
    // Fetch the complete order with items
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          include: [{ model: Laptop }]
        }
      ]
    });
    
    res.status(201).json({ 
      success: true, 
      data: completeOrder, 
      message: 'Order created successfully' 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Error creating order' });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    await order.update({ status });
    res.status(200).json({ 
      success: true, 
      data: order, 
      message: 'Order status updated successfully' 
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Error updating order status' });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Delete order items first
    await OrderItem.destroy({ where: { orderId: id }, transaction });
    
    // Delete order
    await order.destroy({ transaction });
    
    await transaction.commit();
    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting order:', error);
    res.status(500).json({ success: false, message: 'Error deleting order' });
  }
};

// Get pending orders (admin)
export const getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { status: 'Pending' },
      include: [
        {
          model: OrderItem,
          include: [{ model: Laptop }]
        },
        { model: User, attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    res.status(500).json({ success: false, message: 'Error fetching pending orders' });
  }
}; 