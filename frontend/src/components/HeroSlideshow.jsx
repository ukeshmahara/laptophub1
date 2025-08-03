import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Premium Laptops at Unbeatable Prices",
      subtitle: "Discover thousands of verified second-hand laptops from trusted sellers",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=compress&w=1200",
      cta: "Browse Laptops",
      highlight: "Up to 70% off retail prices"
    },
    {
      id: 2,
      title: "Sell Your Laptop in Minutes",
      subtitle: "Get instant quotes and sell your laptop quickly to thousands of buyers",
      image: "https://images.pexels.com/photos/459654/pexels-photo-459654.jpeg?auto=compress&cs=tinysrgb&w=1200",
      cta: "Start Selling",
      highlight: "Fast & secure transactions"
    },
    {
      id: 3,
      title: "Certified Quality Guarantee",
      subtitle: "Every laptop is inspected and comes with our quality assurance promise",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=compress&w=1200",
      cta: "Learn More",
      highlight: "30-day return policy"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="hero-slideshow">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${index === currentSlide ? 'active' : ''}`}
          style={{ display: index === currentSlide ? 'block' : 'none' }}
        >
          <img src={slide.image} alt={slide.title} />
          <div className="slide-overlay">
            <div className="slide-content">
              <div className="slide-text">
                <h1 className="slide-title">{slide.title}</h1>
                <p className="slide-subtitle">{slide.subtitle}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button onClick={prevSlide} className="nav-arrow prev">
        <ChevronLeft size={24} />
      </button>
      <button onClick={nextSlide} className="nav-arrow next">
        <ChevronRight size={24} />
      </button>
      <div className="slide-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlideshow; 