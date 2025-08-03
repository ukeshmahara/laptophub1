import React from 'react';
import { Laptop, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Laptop size={32} color="#60a5fa" />
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>LaptopHub</span>
            </div>
            <p style={{ color: '#d1d5db', marginBottom: '20px', maxWidth: '300px' }}>
              The most trusted marketplace for buying and selling second-hand laptops. 
              Connect with verified buyers and sellers in a secure environment.
            </p>
            <div className="social-links">
              <a href="#"><Facebook size={24} /></a>
              <a href="#"><Twitter size={24} /></a>
              <a href="#"><Instagram size={24} /></a>
              <a href="#"><Linkedin size={24} /></a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#">Browse Laptops</a></li>
              <li><a href="#">Sell Your Laptop</a></li>
              <li><a href="#">How It Works</a></li>
              <li><a href="#">Pricing Guide</a></li>
              <li><a href="#">Success Stories</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Safety Tips</a></li>
              <li><a href="#">Return Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Info</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Mail size={20} color="#60a5fa" />
              <span style={{ color: '#d1d5db' }}>support@laptophub.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Phone size={20} color="#60a5fa" />
              <span style={{ color: '#d1d5db' }}>1-800-LAPTOP-1</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={20} color="#60a5fa" />
              <span style={{ color: '#d1d5db' }}>Available Nationwide</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            © 2024 LaptopHub. All rights reserved.
          </p>
          <div className="footer-links">
            <a href="#">Cookie Policy</a>
            <a href="#">Accessibility</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;