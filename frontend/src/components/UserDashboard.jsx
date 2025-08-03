import React, { useState, useEffect } from 'react';
import './UserDashboard.css';
import CheckoutForm from './CheckoutForm';

const UserDashboard = ({ onNavigate, user, defaultSection = 'overview', cartItems = [], setCartItems, orders = [], onCreateOrder, onUpdateOrderStatus }) => {
  const [activeSection, setActiveSection] = useState(defaultSection);
  const [userName] = useState(user?.name || 'User');
  const [showCheckout, setShowCheckout] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);

  // Fetch user's wishlist from backend
  useEffect(() => {
    if (user && user.id) {
      fetchUserWishlist();
    }
  }, [user]);

  const fetchUserWishlist = async () => {
    try {
      setWishlistLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/wishlist/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      
      if (result.success) {
        // Extract laptop data from wishlist items
        const wishlistLaptops = result.data.map(item => item.Laptop);
        setWishlist(wishlistLaptops);
      } else {
        console.error('Failed to fetch wishlist:', result.message);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const removeFromWishlist = async (laptopId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/wishlist/${user.id}/${laptopId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Remove from local state
        setWishlist(prev => prev.filter(laptop => laptop.id !== laptopId));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const addToCartFromWishlist = (laptop) => {
    // Check if item already exists in cart
    const existingItem = cartItems.find(item => item.id === laptop.id);
    
    if (existingItem) {
      // Update quantity
      setCartItems(prev => 
        prev.map(item => 
          item.id === laptop.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      // Add new item
      setCartItems(prev => [...prev, { ...laptop, quantity: 1 }]);
    }
  };

  // Cart Functions
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const handleConfirmOrder = async (order) => {
    try {
      // Create the order with user ID
      const newOrder = {
        ...order,
        userId: user?.id || 1
      };

      // Add the new order through the parent component
      if (onCreateOrder) {
        onCreateOrder(newOrder);
      }
      
      // Clear the cart
      setCartItems([]);
      
      // Show success message
      alert(`Order ${order.id} has been placed successfully! It is now pending admin approval.`);
      
      // Navigate back to dashboard
      setShowCheckout(false);
      setActiveSection('orders');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('There was an error creating your order. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#ffa500';
      case 'processing':
        return '#007bff';
      case 'shipped':
        return '#ff6348';
      case 'delivered':
        return '#28a745';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const renderOverview = () => (
    <div className="dashboard-overview">
      <div className="welcome-section">
        <h2>Welcome back, {userName}! 👋</h2>
        <p>Here's what's happening with your account today.</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>{getCartItemCount()}</h3>
            <p>Cart Items</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❤️</div>
          <div className="stat-content">
            <h3>{wishlist.length}</h3>
            <p>Wishlist Items</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{orders.length}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>${getCartTotal().toFixed(0)}</h3>
            <p>Cart Total</p>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {orders.slice(0, 3).map((order, index) => (
            <div key={order.id} className="activity-item">
              <div className="activity-icon">📦</div>
              <div className="activity-content">
                <p><strong>Order {order.id}</strong> - {order.status}</p>
                <span className="activity-time">{order.orderDate}</span>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="activity-item">
              <div className="activity-icon">🛒</div>
              <div className="activity-content">
                <p><strong>No orders yet</strong></p>
                <span className="activity-time">Start shopping to see your orders here</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderWishlist = () => (
    <div className="wishlist">
      <h3>My Wishlist ({wishlist.length} items)</h3>
      
      {wishlistLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading wishlist...</p>
        </div>
      ) : wishlist.length === 0 ? (
        <div className="empty-wishlist">
          <p>Your wishlist is empty</p>
          <button className="btn-primary" onClick={() => onNavigate('home')}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="laptops-grid">
          {wishlist.map(laptop => (
            <div key={laptop.id} className="laptop-card">
              <img src={laptop.image} alt={laptop.name} />
              <div className="laptop-info">
                <h4>{laptop.name}</h4>
                <p className="brand">{laptop.brand}</p>
                <div className="laptop-specs">
                  <span>{laptop.processor}</span>
                  <span>{laptop.ram}</span>
                  <span>{laptop.storage}</span>
                </div>
                <div className="price-container">
                  <p className="price">NPR {laptop.price.toLocaleString()}</p>
                  {laptop.discount > 0 && (
                    <p className="original-price">NPR {laptop.originalPrice.toLocaleString()}</p>
                  )}
                </div>
                <div className="wishlist-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => addToCartFromWishlist(laptop)}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => removeFromWishlist(laptop.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderShoppingCart = () => (
    <div className="shopping-cart">
      <h3>Shopping Cart ({getCartItemCount()} items)</h3>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button className="btn-primary" onClick={() => onNavigate('home')}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p className="brand">{item.brand}</p>
                  <p className="price">${item.price}</p>
                </div>
                <div className="quantity-controls">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <div className="item-actions">
                  <button 
                    className="btn-danger"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h4>Order Summary</h4>
            <div className="summary-item">
              <span>Subtotal ({getCartItemCount()} items):</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-item total">
              <span>Total:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <button 
              className="btn-primary checkout-btn"
              onClick={() => setShowCheckout(true)}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="orders">
      <h3>My Orders</h3>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <h4>Order #{order.id}</h4>
              <span 
                className="status" 
                style={{ 
                  backgroundColor: getStatusColor(order.status),
                  color: 'white'
                }}
              >
                {order.status}
              </span>
            </div>
            <div className="order-details">
              <div className="order-items-summary">
                {order.items?.map((item, index) => (
                  <div key={index} className="order-item-summary">
                    <img src={item.laptopImage} alt={item.laptopName} />
                    <div>
                      <p><strong>{item.laptopName}</strong></p>
                      <p>Qty: {item.quantity} | NPR {item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-info">
                <p><strong>Total Amount:</strong> NPR {order.totalAmount?.toLocaleString()}</p>
                <p><strong>Order Date:</strong> {order.orderDate}</p>
                <p><strong>Payment Method:</strong> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                <p><strong>Phone:</strong> {order.phoneNumber}</p>
                {order.additionalNotes && (
                  <p><strong>Notes:</strong> {order.additionalNotes}</p>
                )}
                <p><strong>Estimated Delivery:</strong> {order.estimatedDelivery}</p>
              </div>
            </div>
            <div className="order-actions">
              <button className="btn-secondary">Track Order</button>
              <button className="btn-secondary">View Details</button>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="empty-orders">
            <p>You haven't placed any orders yet.</p>
            <button className="btn-primary" onClick={() => onNavigate('home')}>
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="account-settings">
      <h3>Account Settings</h3>
      <div className="settings-form">
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" defaultValue={userName} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" defaultValue="user@example.com" />
        </div>
        <div className="form-group">
          <label>Shipping Address</label>
          <textarea defaultValue="123 Main St, City, State 12345"></textarea>
        </div>
        <button className="btn-primary">Save Changes</button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (showCheckout) {
      return (
        <CheckoutForm
          cartItems={cartItems}
          onConfirmOrder={handleConfirmOrder}
          onCancel={() => setShowCheckout(false)}
          user={user}
        />
      );
    }

    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'cart':
        return renderShoppingCart();
      case 'wishlist':
        return renderWishlist();
      case 'orders':
        return renderOrders();
      case 'settings':
        return renderAccountSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          ← Back to Home
        </button>
        <div className="user-info">
          <span>Welcome, {userName}</span>
          <button className="logout-btn" onClick={() => onNavigate('home')}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveSection('overview')}
            >
              📊 Overview
            </button>
            <button 
              className={`nav-item ${activeSection === 'cart' ? 'active' : ''}`}
              onClick={() => setActiveSection('cart')}
            >
              🛒 Shopping Cart ({getCartItemCount()})
            </button>
            <button 
              className={`nav-item ${activeSection === 'wishlist' ? 'active' : ''}`}
              onClick={() => setActiveSection('wishlist')}
            >
              ❤️ Wishlist ({wishlist.length})
            </button>
            <button 
              className={`nav-item ${activeSection === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveSection('orders')}
            >
              📋 My Orders ({orders.length})
            </button>
            <button 
              className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveSection('settings')}
            >
              ⚙️ Account Settings
            </button>
          </nav>
        </aside>

        <main className="dashboard-main">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard; 