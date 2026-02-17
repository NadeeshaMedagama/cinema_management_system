import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cartService from '../services/cartService';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';
import './CartPage.css';

const CartPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadCart();
  }, [isAuthenticated, navigate]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Error loading cart:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (merchandiseId, newQuantity) => {
    try {
      setLoading(true);
      await cartService.updateCartItem(merchandiseId, newQuantity);
      await loadCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
      await loadCart();
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (merchandiseId) => {
    try {
      setLoading(true);
      await cartService.removeFromCart(merchandiseId);
      await loadCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Error removing item from cart.');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your entire cart?')) {
      return;
    }

    try {
      setLoading(true);
      await cartService.clearCart();
      await loadCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Error clearing cart.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setShowPayment(true);
  };

  const handlePaymentSuccess = async (payment) => {
    try {
      setLoading(true);

      await cartService.checkout();

      alert(`Payment & Order Successful!\n\nTransaction ID: ${payment.transactionId}\nTotal: Rs.${cart.total.toFixed(2)}\n\nThank you for your purchase!`);

      await loadCart(); // Reload cart (it will be empty after checkout)
      setShowPayment(false);
    } catch (error) {
      console.error('Error during checkout:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to complete order';
      alert(`Order failed: ${errorMessage}\nYour payment was successful. Please contact support with Transaction ID: ${payment.transactionId}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !cart) {
    return (
      <div className="cart-page">
        <div className="loading">Loading your cart...</div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header-section">
          <h1>Shopping Cart</h1>
          <button onClick={() => navigate('/merchandise')} className="continue-shopping">
            ← Continue Shopping
          </button>
        </div>

        {!cart || cart.items.length === 0 ? (
          <div className="empty-cart-message">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some merchandise to get started!</p>
            <button onClick={() => navigate('/merchandise')} className="shop-now-btn">
              Shop Merchandise
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-section">
              <div className="cart-items-header">
                <h2>Items ({cart.items.length})</h2>
                <button onClick={clearCart} className="clear-cart-btn" disabled={loading}>
                  Clear Cart
                </button>
              </div>

              <div className="cart-items-list">
                {cart.items.map(item => (
                  <div key={item.merchandiseId} className="cart-item-card">
                    <div className="item-image">
                      <img 
                        src={item.imageUrl || 'https://via.placeholder.com/150x150?text=No+Image'} 
                        alt={item.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                        }}
                      />
                    </div>

                    <div className="item-details">
                      <h3>{item.name}</h3>
                      {item.characterName && (
                        <p className="item-character">⭐ {item.characterName}</p>
                      )}
                      {item.relatedMovie && (
                        <p className="item-movie">🎬 {item.relatedMovie}</p>
                      )}
                      <p className="item-category">{item.category?.replace('_', ' ')}</p>
                    </div>

                    <div className="item-price">
                      <p className="unit-price">Rs. {item.price.toFixed(2)}</p>
                    </div>

                    <div className="item-quantity">
                      <button 
                        onClick={() => updateQuantity(item.merchandiseId, item.quantity - 1)}
                        disabled={loading}
                        className="qty-btn"
                      >
                        -
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.merchandiseId, item.quantity + 1)}
                        disabled={loading}
                        className="qty-btn"
                      >
                        +
                      </button>
                    </div>

                    <div className="item-subtotal">
                      <p className="subtotal-label">Subtotal</p>
                      <p className="subtotal-amount">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.merchandiseId)}
                      disabled={loading}
                      className="remove-item-btn"
                      title="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="cart-summary-section">
              <div className="summary-card">
                <h2>Order Summary</h2>
                
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>Rs. {cart.total.toFixed(2)}</span>
                </div>

                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="free">FREE</span>
                </div>

                <div className="summary-row">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row total">
                  <span>Total</span>
                  <span>Rs. {cart.total.toFixed(2)}</span>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={loading}
                  className="checkout-button"
                >
                  {loading ? 'Processing...' : 'Proceed to Checkout'}
                </button>

                <div className="security-badges">
                  <p>🔒 Secure Checkout</p>
                  <p>✓ 100% Satisfaction Guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <PaymentModal
        show={showPayment}
        onClose={() => setShowPayment(false)}
        amount={cart?.total || 0}
        onPaymentSuccess={handlePaymentSuccess}
        bookingId={null}
        orderId={cart?.id}
        paymentType="ORDER"
      />
    </div>
  );
};

export default CartPage;
