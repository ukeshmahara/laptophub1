import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Menu, X, Laptop } from 'lucide-react';
import laptops from '../data/laptops.js';

const Header = ({ onNavigate, user, admin, searchQuery, setSearchQuery, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  // Filter laptops based on search query
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = laptops.filter(laptop =>
        laptop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        laptop.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        laptop.specs?.processor?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (laptop) => {
    setSearchQuery(laptop.name);
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (searchQuery.trim().length > 0 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Fallback logout
      window.location.reload();
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <a href="#" className="logo" onClick={() => onNavigate('home')}>
          <Laptop size={32} />
          <span>LaptopHub</span>
        </a>

        <div className="search-container" ref={searchRef}>
          <input
            type="text"
            placeholder="Search laptops, brands, models..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className="search-input"
          />
          <Search className="search-icon" size={20} />
          
          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && (
            <div className="search-suggestions">
              {suggestions.map((laptop) => (
                <div
                  key={laptop.id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(laptop)}
                >
                  <div className="suggestion-content">
                    <div className="suggestion-name">{laptop.name}</div>
                    <div className="suggestion-details">
                      <span className="suggestion-brand">{laptop.brand}</span>
                      <span className="suggestion-price">NPR {laptop.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="suggestion-image">
                    <img src={laptop.image} alt={laptop.name} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <nav className="nav-links">
          <a href="#" onClick={() => onNavigate('home')}>Home</a>
          <a href="#" onClick={() => onNavigate('about')}>About</a>
          {user && (
            <a href="#" onClick={() => onNavigate('dashboard')}>Dashboard</a>
          )}
          {admin && (
            <a href="#" onClick={() => onNavigate('admin-dashboard')}>Admin Panel</a>
          )}
        </nav>

        <div className="auth-buttons">
          {admin ? (
            <div className="user-menu">
              <span className="user-name">Admin: {admin.name}</span>
              <button 
                className="btn btn-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : user ? (
            <div className="user-menu">
              <span className="user-name">Hi, {user.name}</span>
              <button 
                className="btn btn-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button 
                className="btn btn-login"
                onClick={() => onNavigate('login')}
              >
                Login
              </button>
              <button 
                className="btn btn-register"
                onClick={() => onNavigate('register')}
              >
                Register
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="mobile-menu-btn"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Header;