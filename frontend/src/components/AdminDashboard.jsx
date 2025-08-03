import React, { useState } from 'react';
import './AdminDashboard.css';
import laptops from '../data/laptops.js';

const mockUsers = [
  { id: 1, name: 'Alice Admin', email: 'alice@admin.com' },
  { id: 2, name: 'Bob User', email: 'bob@user.com' },
  { id: 3, name: 'Charlie User', email: 'charlie@user.com' },
];

// Mock orders data
const mockOrders = [
  {
    id: 'ORD-001',
    userId: 2,
    userName: 'Bob User',
    userEmail: 'bob@user.com',
    laptopId: 1,
    laptopName: 'Lenovo IdeaPad 3',
    laptopImage: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&w=400',
    quantity: 1,
    totalPrice: 45000,
    orderDate: '2024-01-20',
    status: 'Processing',
    estimatedDelivery: '2024-01-25',
    shippingAddress: '123 Main St, Kathmandu, Nepal'
  },
  {
    id: 'ORD-002',
    userId: 3,
    userName: 'Charlie User',
    userEmail: 'charlie@user.com',
    laptopId: 4,
    laptopName: 'ASUS VivoBook S15',
    laptopImage: 'https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg?auto=compress&w=400',
    quantity: 1,
    totalPrice: 58000,
    orderDate: '2024-01-18',
    status: 'Shipped',
    estimatedDelivery: '2024-01-23',
    shippingAddress: '456 Oak Ave, Pokhara, Nepal'
  },
  {
    id: 'ORD-003',
    userId: 2,
    userName: 'Bob User',
    userEmail: 'bob@user.com',
    laptopId: 9,
    laptopName: 'ASUS TUF Gaming A15',
    laptopImage: 'https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg?auto=compress&w=400',
    quantity: 1,
    totalPrice: 85000,
    orderDate: '2024-01-15',
    status: 'Delivered',
    estimatedDelivery: '2024-01-20',
    shippingAddress: '123 Main St, Kathmandu, Nepal'
  }
];

const AdminDashboard = ({ onNavigate, admin, orders = [], onUpdateOrderStatus }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [users, setUsers] = useState(mockUsers);
  const [laptopList, setLaptopList] = useState(laptops);
  const [showAddLaptop, setShowAddLaptop] = useState(false);
  const [editingLaptop, setEditingLaptop] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // New laptop form state
  const [newLaptop, setNewLaptop] = useState({
    name: '',
    brand: '',
    price: '',
    originalPrice: '',
    image: '',
    description: '',
    processor: '',
    ram: '',
    storage: '',
    display: '',
    os: '',
    inStock: true,
    isNew: false
  });

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleDeleteLaptop = (id) => {
    if (window.confirm('Are you sure you want to delete this laptop?')) {
      setLaptopList(laptopList.filter(laptop => laptop.id !== id));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setNewLaptop({...newLaptop, image: e.target.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLaptop = (e) => {
    e.preventDefault();
    const laptopToAdd = {
      ...newLaptop,
      id: Math.max(...laptopList.map(l => l.id)) + 1,
      price: parseInt(newLaptop.price),
      originalPrice: parseInt(newLaptop.originalPrice),
      rating: 4.0,
      reviews: 0,
      discount: Math.round(((newLaptop.originalPrice - newLaptop.price) / newLaptop.originalPrice) * 100),
      specs: {
        processor: newLaptop.processor,
        ram: newLaptop.ram,
        storage: newLaptop.storage,
        display: newLaptop.display,
        os: newLaptop.os
      }
    };
    setLaptopList([...laptopList, laptopToAdd]);
    setNewLaptop({
      name: '',
      brand: '',
      price: '',
      originalPrice: '',
      image: '',
      description: '',
      processor: '',
      ram: '',
      storage: '',
      display: '',
      os: '',
      inStock: true,
      isNew: false
    });
    setSelectedImage(null);
    setImagePreview('');
    setShowAddLaptop(false);
  };

  const handleEditLaptop = (laptop) => {
    setEditingLaptop(laptop);
    setNewLaptop({
      name: laptop.name,
      brand: laptop.brand,
      price: laptop.price.toString(),
      originalPrice: laptop.originalPrice.toString(),
      image: laptop.image,
      description: laptop.description || '',
      processor: laptop.specs.processor,
      ram: laptop.specs.ram,
      storage: laptop.specs.storage,
      display: laptop.specs.display,
      os: laptop.specs.os,
      inStock: laptop.inStock,
      isNew: laptop.isNew
    });
    setImagePreview(laptop.image);
    setShowAddLaptop(true);
  };

  const handleUpdateLaptop = (e) => {
    e.preventDefault();
    const updatedLaptop = {
      ...editingLaptop,
      ...newLaptop,
      price: parseInt(newLaptop.price),
      originalPrice: parseInt(newLaptop.originalPrice),
      discount: Math.round(((newLaptop.originalPrice - newLaptop.price) / newLaptop.originalPrice) * 100),
      specs: {
        processor: newLaptop.processor,
        ram: newLaptop.ram,
        storage: newLaptop.storage,
        display: newLaptop.display,
        os: newLaptop.os
      }
    };
    setLaptopList(laptopList.map(laptop => 
      laptop.id === editingLaptop.id ? updatedLaptop : laptop
    ));
    setEditingLaptop(null);
    setNewLaptop({
      name: '',
      brand: '',
      price: '',
      originalPrice: '',
      image: '',
      description: '',
      processor: '',
      ram: '',
      storage: '',
      display: '',
      os: '',
      inStock: true,
      isNew: false
    });
    setSelectedImage(null);
    setImagePreview('');
    setShowAddLaptop(false);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(orderId, newStatus);
    }
  };

  const getPendingOrders = () => {
    return orders.filter(order => order.status === 'Pending');
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
        <h2>Welcome, {admin?.name || 'Admin'}! 👑</h2>
        <p>Admin control panel overview.</p>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💻</div>
          <div className="stat-content">
            <h3>{laptopList.length}</h3>
            <p>Total Laptops</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{orders.length}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{getPendingOrders().length}</h3>
            <p>Pending Orders</p>
          </div>
        </div>
      </div>
      <div className="recent-activity">
        <h3>Recent Admin Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">💻</div>
            <div className="activity-content">
              <p><strong>Added</strong> new laptop to inventory</p>
              <span className="activity-time">1 day ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📦</div>
            <div className="activity-content">
              <p><strong>Updated</strong> order ORD-002 status to Shipped</p>
              <span className="activity-time">2 days ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">👥</div>
            <div className="activity-content">
              <p><strong>Deleted</strong> user John Doe</p>
              <span className="activity-time">3 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLaptopManagement = () => (
    <div className="laptop-management">
      <div className="section-header">
        <h3>Laptop Management</h3>
        <button 
          className="btn-primary" 
          onClick={() => {
            setShowAddLaptop(true);
            setEditingLaptop(null);
            setNewLaptop({
              name: '',
              brand: '',
              price: '',
              originalPrice: '',
              image: '',
              description: '',
              processor: '',
              ram: '',
              storage: '',
              display: '',
              os: '',
              inStock: true,
              isNew: false
            });
            setSelectedImage(null);
            setImagePreview('');
          }}
        >
          ➕ Add New Laptop
        </button>
      </div>

      {showAddLaptop && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h4>{editingLaptop ? 'Edit Laptop' : 'Add New Laptop'}</h4>
              <button 
                className="close-btn" 
                onClick={() => {
                  setShowAddLaptop(false);
                  setEditingLaptop(null);
                  setSelectedImage(null);
                  setImagePreview('');
                }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={editingLaptop ? handleUpdateLaptop : handleAddLaptop}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={newLaptop.name}
                    onChange={(e) => setNewLaptop({...newLaptop, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Brand</label>
                  <input
                    type="text"
                    value={newLaptop.brand}
                    onChange={(e) => setNewLaptop({...newLaptop, brand: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price (NPR)</label>
                  <input
                    type="number"
                    value={newLaptop.price}
                    onChange={(e) => setNewLaptop({...newLaptop, price: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Original Price (NPR)</label>
                  <input
                    type="number"
                    value={newLaptop.originalPrice}
                    onChange={(e) => setNewLaptop({...newLaptop, originalPrice: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={newLaptop.description}
                    onChange={(e) => setNewLaptop({...newLaptop, description: e.target.value})}
                    rows="3"
                    placeholder="Enter laptop description..."
                  />
                </div>
                <div className="form-group">
                  <label>Image Upload</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input"
                  />
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" style={{width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px'}} />
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>Processor</label>
                  <input
                    type="text"
                    value={newLaptop.processor}
                    onChange={(e) => setNewLaptop({...newLaptop, processor: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>RAM</label>
                  <input
                    type="text"
                    value={newLaptop.ram}
                    onChange={(e) => setNewLaptop({...newLaptop, ram: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Storage</label>
                  <input
                    type="text"
                    value={newLaptop.storage}
                    onChange={(e) => setNewLaptop({...newLaptop, storage: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Display</label>
                  <input
                    type="text"
                    value={newLaptop.display}
                    onChange={(e) => setNewLaptop({...newLaptop, display: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Operating System</label>
                  <input
                    type="text"
                    value={newLaptop.os}
                    onChange={(e) => setNewLaptop({...newLaptop, os: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>In Stock</label>
                  <select
                    value={newLaptop.inStock}
                    onChange={(e) => setNewLaptop({...newLaptop, inStock: e.target.value === 'true'})}
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Is New</label>
                  <select
                    value={newLaptop.isNew}
                    onChange={(e) => setNewLaptop({...newLaptop, isNew: e.target.value === 'true'})}
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  {editingLaptop ? 'Update Laptop' : 'Add Laptop'}
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowAddLaptop(false);
                    setEditingLaptop(null);
                    setSelectedImage(null);
                    setImagePreview('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Price (NPR)</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {laptopList.map(laptop => (
              <tr key={laptop.id}>
                <td>{laptop.id}</td>
                <td>
                  <img 
                    src={laptop.image} 
                    alt={laptop.name} 
                    style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px'}}
                  />
                </td>
                <td>{laptop.name}</td>
                <td>{laptop.brand}</td>
                <td>NPR {laptop.price.toLocaleString()}</td>
                <td>
                  <span className={`status ${laptop.inStock ? 'in-stock' : 'out-of-stock'}`}>
                    {laptop.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn-secondary" 
                    onClick={() => handleEditLaptop(laptop)}
                    style={{marginRight: '5px'}}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-danger" 
                    onClick={() => handleDeleteLaptop(laptop.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrderManagement = () => (
    <div className="order-management">
      <h3>Order Management</h3>
      
      {/* Pending Orders Section */}
      <div className="pending-orders-section">
        <h4>⏳ Pending Orders ({getPendingOrders().length})</h4>
        {getPendingOrders().length > 0 ? (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Products</th>
                  <th>Total Amount</th>
                  <th>Payment Method</th>
                  <th>Order Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getPendingOrders().map(order => (
                  <tr key={order.id} style={{backgroundColor: '#fff3cd'}}>
                    <td><strong>{order.id}</strong></td>
                    <td>
                      <div>
                        <div><strong>{order.userName}</strong></div>
                        <div style={{fontSize: '12px', color: '#666'}}>{order.userEmail}</div>
                        <div style={{fontSize: '12px', color: '#666'}}>{order.phoneNumber}</div>
                      </div>
                    </td>
                    <td>
                      <div style={{maxWidth: '200px'}}>
                        {order.items?.map((item, index) => (
                          <div key={index} style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px'}}>
                            <img 
                              src={item.laptopImage} 
                              alt={item.laptopName} 
                              style={{width: '30px', height: '30px', objectFit: 'cover', borderRadius: '4px'}}
                            />
                            <span style={{fontSize: '12px'}}>{item.laptopName} (x{item.quantity})</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>NPR {order.totalAmount?.toLocaleString()}</td>
                    <td>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</td>
                    <td>{order.orderDate}</td>
                    <td>
                      <select 
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="status-select"
                        style={{marginBottom: '5px'}}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button 
                        className="btn-secondary" 
                        onClick={() => alert(`Order Details:\nOrder ID: ${order.id}\nCustomer: ${order.userName}\nAddress: ${order.deliveryAddress}\nPhone: ${order.phoneNumber}\nNotes: ${order.additionalNotes || 'None'}\nEstimated Delivery: ${order.estimatedDelivery}`)}
                        style={{width: '100%', fontSize: '12px'}}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{textAlign: 'center', padding: '2rem', color: '#666'}}>
            <p>No pending orders at the moment.</p>
          </div>
        )}
      </div>

      {/* All Orders Section */}
      <div className="all-orders-section" style={{marginTop: '2rem'}}>
        <h4>📦 All Orders</h4>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Products</th>
                <th>Total Amount</th>
                <th>Order Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    <div>
                      <div><strong>{order.userName}</strong></div>
                      <div style={{fontSize: '12px', color: '#666'}}>{order.userEmail}</div>
                    </div>
                  </td>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                      <img 
                        src={order.items?.[0]?.laptopImage || order.laptopImage} 
                        alt={order.items?.[0]?.laptopName || order.laptopName} 
                        style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '5px'}}
                      />
                      <span>{order.items?.[0]?.laptopName || order.laptopName}</span>
                    </div>
                  </td>
                  <td>NPR {order.totalAmount?.toLocaleString() || order.totalPrice?.toLocaleString()}</td>
                  <td>{order.orderDate}</td>
                  <td>
                    <span 
                      className="status" 
                      style={{ 
                        backgroundColor: getStatusColor(order.status),
                        color: 'white'
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select 
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <button 
                      className="btn-secondary" 
                      onClick={() => alert(`Order Details:\nOrder ID: ${order.id}\nCustomer: ${order.userName}\nAddress: ${order.deliveryAddress || order.shippingAddress}\nEstimated Delivery: ${order.estimatedDelivery}`)}
                      style={{marginLeft: '5px'}}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="user-management">
      <h3>User Management</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button className="btn-secondary" onClick={() => alert(`Viewing user ${user.name}`)}>View</button>
                <button className="btn-danger" onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'laptops':
        return renderLaptopManagement();
      case 'orders':
        return renderOrderManagement();
      case 'users':
        return renderUserManagement();
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
          <span>Admin: {admin?.name || 'Admin'}</span>
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
              className={`nav-item ${activeSection === 'laptops' ? 'active' : ''}`}
              onClick={() => setActiveSection('laptops')}
            >
              💻 Laptop Management
            </button>
            <button 
              className={`nav-item ${activeSection === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveSection('orders')}
            >
              📦 Order Management ({getPendingOrders().length})
            </button>
            <button 
              className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
              onClick={() => setActiveSection('users')}
            >
              👥 User Management
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

export default AdminDashboard; 