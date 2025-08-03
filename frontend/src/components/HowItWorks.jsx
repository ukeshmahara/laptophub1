import React from 'react';
import { Search, MessageCircle, CreditCard, Package } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Browse & Search",
      description: "Find your perfect laptop from thousands of verified listings with detailed specs and photos",
      color: "#2563eb",
      bgColor: "#dbeafe"
    },
    {
      icon: MessageCircle,
      title: "Connect & Negotiate",
      description: "Chat directly with sellers, ask questions, and negotiate the best price for your needs",
      color: "#059669",
      bgColor: "#d1fae5"
    },
    {
      icon: CreditCard,
      title: "Secure Payment",
      description: "Complete your purchase using our secure payment system with buyer protection",
      color: "#7c3aed",
      bgColor: "#ede9fe"
    },
    {
      icon: Package,
      title: "Fast Delivery",
      description: "Receive your laptop quickly with tracking information and insurance coverage",
      color: "#ea580c",
      bgColor: "#fed7aa"
    }
  ];

  return (
    <section className="how-it-works">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Getting your next laptop is simple and secure. Follow these easy steps 
            to find and purchase your perfect device.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="step-card">
                <div 
                  className="step-icon" 
                  style={{ backgroundColor: step.bgColor }}
                >
                  <IconComponent size={32} color={step.color} />
                </div>
                
                <div className="step-number">{index + 1}</div>
                
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center' }}>
          <div className="cta-section">
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>Ready to get started?</p>
            <div className="cta-buttons">
              <button className="btn-primary">Start Buying</button>
              <button className="btn-secondary">Start Selling</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;