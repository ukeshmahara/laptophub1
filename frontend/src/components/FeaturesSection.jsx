import React from 'react';
import { Shield, Zap, Users, Award, CheckCircle, Headphones } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "Advanced encryption and fraud protection for every purchase and sale"
    },
    {
      icon: CheckCircle,
      title: "Quality Verified",
      description: "Every laptop undergoes thorough inspection and certification process"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Quick listing, instant quotes, and rapid transaction processing"
    },
    {
      icon: Users,
      title: "Trusted Community",
      description: "Join thousands of verified buyers and sellers in our marketplace"
    },
    {
      icon: Award,
      title: "Best Prices",
      description: "Competitive pricing with up to 70% savings on premium laptops"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer service to help with any questions"
    }
  ];

  return (
    <section className="features-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Why Choose LaptopHub?</h2>
          <p className="section-subtitle">
            We're committed to providing the best second-hand laptop marketplace experience 
            with unmatched security, quality, and customer service.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <IconComponent size={24} color="#2563eb" />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;