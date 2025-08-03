import React, { useState } from 'react';
import Header from './components/Header';
import HeroSlideshow from './components/HeroSlideshow';
import LaptopShowcase from './components/LaptopShowcase';
import FeaturesSection from './components/FeaturesSection';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [cart, setCart] = useState([]);
  const [defaultDashboardSection, setDefaultDashboardSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Shared orders state between user and admin
  const [orders, setOrders] = useState([]);

  const handleLogout = () => {
    setUser(null);
    setAdmin(null);
    setCart([]);
    setCurrentPage('home');
  };

  const addToCart = (laptop) => {
    setCart((prev) => {
      const found = prev.find(item => item.id === laptop.id);
      if (found) {
        return prev.map(item =>
          item.id === laptop.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...laptop, quantity: 1 }];
    });
  };

  const handleCreateOrder = (newOrder) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} onLogin={(userData) => {
          setUser(userData);
          setCurrentPage('dashboard');
        }} />;
      case 'register':
        return <RegisterPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <UserDashboard 
          onNavigate={setCurrentPage} 
          user={user} 
          defaultSection={defaultDashboardSection}
          cartItems={cart}
          setCartItems={setCart}
          orders={orders.filter(order => order.userId === (user?.id || 1))}
          onCreateOrder={handleCreateOrder}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />;
      case 'admin-dashboard':
        return <AdminDashboard 
          onNavigate={setCurrentPage} 
          admin={admin}
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />;
      case 'about':
        return (
          <div className="app">
            <Header 
              onNavigate={setCurrentPage} 
              user={user} 
              admin={admin}
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery}
              onLogout={handleLogout}
            />
            <HowItWorks />
            <Footer />
          </div>
        );
      default:
        return (
          <div className="app">
            <Header 
              onNavigate={setCurrentPage} 
              user={user} 
              admin={admin}
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery}
              onLogout={handleLogout}
            />
            <HeroSlideshow />
            <LaptopShowcase 
              user={user} 
              admin={admin}
              onNavigate={setCurrentPage} 
              addToCart={addToCart} 
              setDefaultDashboardSection={setDefaultDashboardSection} 
              searchQuery={searchQuery} 
            />
            <FeaturesSection />
            <HowItWorks />
            <Footer />
          </div>
        );
    }
  };

  return renderPage();
}

export default App;