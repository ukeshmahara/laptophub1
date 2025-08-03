import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import laptops from '../data/laptops.js';

const LaptopShowcase = ({ user, admin, onNavigate, addToCart, setDefaultDashboardSection, searchQuery = '' }) => {
  const [showAllLaptops, setShowAllLaptops] = useState(false);
  const [laptopsData, setLaptopsData] = useState(laptops);
  const [loading, setLoading] = useState(false);
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [wishlistLoading, setWishlistLoading] = useState({});

  // Fetch user's wishlist if logged in
  useEffect(() => {
    if (user && user.id) {
      fetchUserWishlist();
    }
  }, [user]);

  const fetchUserWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/wishlist/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      
      if (result.success) {
        const wishlistIds = new Set(result.data.map(item => item.laptopId));
        setWishlistItems(wishlistIds);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const handleWishlistToggle = async (laptopId) => {
    if (!user) {
      onNavigate('login');
      return;
    }

    try {
      setWishlistLoading(prev => ({ ...prev, [laptopId]: true }));
      const token = localStorage.getItem('token');
      const isInWishlist = wishlistItems.has(laptopId);

      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(`http://localhost:4000/api/wishlist/${user.id}/${laptopId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          setWishlistItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(laptopId);
            return newSet;
          });
        }
      } else {
        // Add to wishlist
        const response = await fetch('http://localhost:4000/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: user.id,
            laptopId: laptopId
          })
        });
        
        if (response.ok) {
          setWishlistItems(prev => new Set([...prev, laptopId]));
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setWishlistLoading(prev => ({ ...prev, [laptopId]: false }));
    }
  };

  const handleBuyNow = (laptop) => {
    if (!user && !admin) {
      onNavigate('login');
    } else {
      addToCart(laptop);
      if (setDefaultDashboardSection) setDefaultDashboardSection('cart');
      if (admin) {
        onNavigate('admin-dashboard');
      } else {
        onNavigate('dashboard');
      }
    }
  };

  const handleAdminView = (laptop) => {
    if (admin) {
      onNavigate('admin-dashboard');
    }
  };

  // Filter laptops by searchQuery (case-insensitive, matches name, brand, or model)
  const filteredLaptops = searchQuery
    ? laptopsData.filter(laptop =>
        laptop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        laptop.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : laptopsData;

  // Show only first 6 laptops initially, or all if showAllLaptops is true
  const displayedLaptops = showAllLaptops ? filteredLaptops : filteredLaptops.slice(0, 6);

  if (loading) {
    return (
      <section className="laptop-showcase">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Laptops</h2>
            <p className="section-subtitle">
              Discover amazing deals on premium laptops from trusted sellers.
            </p>
          </div>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading laptops...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="laptop-showcase">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Featured Laptops</h2>
          <p className="section-subtitle">
            Discover amazing deals on premium laptops from trusted sellers.
          </p>
        </div>

        <div className="laptop-grid">
          {displayedLaptops.map((laptop) => (
            <div key={laptop.id} className="laptop-card">
              <div className="laptop-image-container">
                <img
                  src={laptop.image}
                  alt={laptop.name}
                  className="laptop-image"
                />
                <button
                  className={`wishlist-btn ${wishlistItems.has(laptop.id) ? 'in-wishlist' : ''}`}
                  onClick={() => handleWishlistToggle(laptop.id)}
                  disabled={wishlistLoading[laptop.id]}
                  title={wishlistItems.has(laptop.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {wishlistLoading[laptop.id] ? (
                    <div className="wishlist-loading"></div>
                  ) : wishlistItems.has(laptop.id) ? (
                    <FaHeart />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
              </div>
              <div className="laptop-info">
                <h3 className="laptop-name">{laptop.name}</h3>
                <div className="laptop-specs">
                  <span className="laptop-brand">{laptop.brand}</span>
                  <span className="laptop-processor">{laptop.specs.processor}</span>
                  <span className="laptop-ram">{laptop.specs.ram}</span>
                </div>
                <div className="laptop-rating">
                  <span className="stars">★★★★☆</span>
                  <span className="rating-text">{laptop.rating} ({laptop.reviews} reviews)</span>
                </div>
                <div className="laptop-footer">
                  <div className="price-container">
                    <span className="laptop-price">
                      NPR {laptop.price.toLocaleString()}
                    </span>
                    {laptop.discount > 0 && (
                      <span className="original-price">
                        NPR {laptop.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {admin ? (
                    <button 
                      className="btn-buy" 
                      onClick={() => handleAdminView(laptop)}
                      style={{ background: '#667eea' }}
                    >
                      Manage
                    </button>
                  ) : (
                    <button className="btn-buy" onClick={() => handleBuyNow(laptop)}>
                      Buy Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLaptops.length > 6 && !showAllLaptops && (
          <button 
            className="view-all-btn" 
            onClick={() => setShowAllLaptops(true)}
          >
            View All Laptops
          </button>
        )}
      </div>
    </section>
  );
};

export default LaptopShowcase;