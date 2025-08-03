import React, { useState } from 'react';
import './CheckoutForm.css';

const CheckoutForm = ({ cartItems, onConfirmOrder, onCancel, user }) => {
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phoneNumber: '',
    deliveryAddress: '',
    paymentMethod: 'cod', // cod = Cash on Delivery, online = Online Payment
    additionalNotes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phoneNumber || !formData.deliveryAddress) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order object
      const order = {
        id: `ORD-${Date.now()}`,
        userId: user?.id || 1,
        userName: formData.fullName,
        userEmail: user?.email || 'user@example.com',
        phoneNumber: formData.phoneNumber,
        deliveryAddress: formData.deliveryAddress,
        paymentMethod: formData.paymentMethod,
        additionalNotes: formData.additionalNotes,
        items: cartItems.map(item => ({
          laptopId: item.id,
          laptopName: item.name,
          laptopImage: item.image,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: calculateTotal(),
        orderDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
      };

      // Call the parent function to handle order creation
      await onConfirmOrder(order);
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert('There was an error creating your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h2>Checkout</h2>
        <p>Please provide your delivery information to complete your order.</p>
      </div>

      <div className="checkout-content">
        <div className="checkout-form-section">
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-section">
              <h3>Delivery Information</h3>
              
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number *</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="deliveryAddress">Delivery Address *</label>
                <textarea
                  id="deliveryAddress"
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your complete delivery address"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="additionalNotes">Additional Notes</label>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  placeholder="Any special instructions for delivery"
                  rows="2"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Payment Method</h3>
              
              <div className="payment-options">
                <div className="payment-option">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="cod">
                    <div className="payment-option-content">
                      <span className="payment-icon">💵</span>
                      <div>
                        <strong>Cash on Delivery</strong>
                        <p>Pay when you receive your order</p>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="payment-option">
                  <input
                    type="radio"
                    id="online"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === 'online'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="online">
                    <div className="payment-option-content">
                      <span className="payment-icon">💳</span>
                      <div>
                        <strong>Online Payment</strong>
                        <p>Pay securely with card or digital wallet</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Back to Cart
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Confirm Order'}
              </button>
            </div>
          </form>
        </div>

        <div className="order-summary-section">
          <div className="order-summary">
            <h3>Order Summary</h3>
            
            <div className="order-items">
              {cartItems.map((item, index) => (
                <div key={index} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p className="item-brand">{item.brand}</p>
                    <p className="item-quantity">Qty: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    NPR {item.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-total">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>NPR {calculateTotal().toLocaleString()}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="total-row total">
                <span>Total:</span>
                <span>NPR {calculateTotal().toLocaleString()}</span>
              </div>
            </div>

            <div className="delivery-info">
              <h4>Delivery Information</h4>
              <p>📦 Estimated delivery: 5-7 business days</p>
              <p>🛡️ Secure payment and buyer protection</p>
              <p>📞 24/7 customer support available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm; 