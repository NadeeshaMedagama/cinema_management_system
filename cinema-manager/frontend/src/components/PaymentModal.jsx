import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './PaymentModal.css';
import paymentService from '../services/paymentService';

// Stripe will be initialized when config is loaded
let stripePromise = null;

// Stripe Card Form Component
const StripeCardForm = ({ amount, onPaymentSuccess, onClose, bookingId, orderId, paymentType }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create PaymentIntent when component mounts
    const initializePayment = async () => {
      try {
        const paymentIntent = await paymentService.createPaymentIntent(amount, 'usd');
        setClientSecret(paymentIntent.clientSecret);
      } catch (error) {
        console.error('Error initializing payment:', error);
        alert('Failed to initialize payment. Please try again.');
      }
    };

    initializePayment();
  }, [amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);

    try {
      // Step 1: Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Step 2: Create payment record in backend
        const paymentData = {
          amount: amount,
          bookingId: bookingId,
          orderId: orderId,
          paymentType: paymentType,
          paymentMethod: 'CARD'
        };

        const payment = await paymentService.createPayment(paymentData);

        // Step 3: Process payment with Stripe PaymentIntent ID
        const processedPayment = await paymentService.processPayment(
          payment.id,
          'CARD',
          paymentIntent.id
        );

        // Step 4: Call success callback
        if (onPaymentSuccess) {
          await onPaymentSuccess(processedPayment);
        }

        alert(`Payment Successful!\nTransaction ID: ${processedPayment.transactionId}\nAmount: Rs.${amount.toFixed(2)}`);
        onClose();
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + (error.message || 'Please try again'));
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    hidePostalCode: false, // Show postal code field
    style: {
      base: {
        fontSize: '16px',
        color: '#333',
        '::placeholder': {
          color: '#999',
        },
      },
      invalid: {
        color: '#f44336',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="payment-form">
        <div className="form-group">
          <label>Card Details</label>
          <div style={{
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            background: 'white'
          }}>
            <CardElement options={cardElementOptions} />
          </div>
        </div>
      </div>

      <div className="payment-actions">
        <button
          type="button"
          className="cancel-btn"
          onClick={onClose}
          disabled={processing}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="pay-btn"
          disabled={processing || !stripe}
        >
          {processing ? 'Processing...' : `Pay Rs. ${amount.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
};

const PaymentModal = ({ show, onClose, amount, onPaymentSuccess, bookingId, orderId, paymentType }) => {
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [stripeLoaded, setStripeLoaded] = useState(false);

  // Load Stripe configuration
  useEffect(() => {
    const loadStripeConfig = async () => {
      try {
        const config = await paymentService.getStripeConfig();
        stripePromise = loadStripe(config.publishableKey);
        setStripeLoaded(true);
      } catch (error) {
        console.error('Error loading Stripe config:', error);
        alert('Failed to load payment gateway. Please refresh the page.');
      }
    };

    if (show && !stripePromise) {
      loadStripeConfig();
    }
  }, [show]);

  if (!show) return null;

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // For non-card payments (UPI, Wallet)
      const paymentData = {
        amount: amount,
        bookingId: bookingId,
        orderId: orderId,
        paymentType: paymentType,
        paymentMethod: paymentMethod
      };

      const payment = await paymentService.createPayment(paymentData);
      const processedPayment = await paymentService.processPayment(payment.id, paymentMethod);

      if (onPaymentSuccess) {
        await onPaymentSuccess(processedPayment);
      }

      alert(`Payment Successful!\nTransaction ID: ${processedPayment.transactionId}\nAmount: Rs.${amount.toFixed(2)}`);
      onClose();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + (error.response?.data?.message || error.message || 'Please try again'));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="payment-modal-header">
          <h2>Complete Payment</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="payment-modal-body">
          <div className="payment-amount">
            <h3>Total Amount</h3>
            <p className="amount">Rs. {amount.toFixed(2)}</p>
          </div>

          <div className="payment-methods">
            <h4>Select Payment Method</h4>
            <div className="payment-method-tabs">
              <button
                type="button"
                className={`method-tab ${paymentMethod === 'CARD' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('CARD')}
              >
                💳 Card
              </button>
              <button
                type="button"
                className={`method-tab ${paymentMethod === 'UPI' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('UPI')}
              >
                📱 UPI
              </button>
              <button
                type="button"
                className={`method-tab ${paymentMethod === 'WALLET' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('WALLET')}
              >
                👛 Wallet
              </button>
            </div>
          </div>

          {paymentMethod === 'CARD' && stripeLoaded && stripePromise && (
            <Elements stripe={stripePromise}>
              <StripeCardForm
                amount={amount}
                onPaymentSuccess={onPaymentSuccess}
                onClose={onClose}
                bookingId={bookingId}
                orderId={orderId}
                paymentType={paymentType}
              />
            </Elements>
          )}

          {paymentMethod === 'CARD' && !stripeLoaded && (
            <div className="payment-form">
              <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                Loading secure payment gateway...
              </p>
            </div>
          )}

          {paymentMethod === 'UPI' && (
            <form onSubmit={handlePayment}>
              <div className="payment-form">
                <div className="form-group">
                  <label>UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                  />
                </div>
                <div className="upi-info">
                  <p>Enter your UPI ID to proceed with payment</p>
                </div>
              </div>

              <div className="payment-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={onClose}
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="pay-btn"
                  disabled={processing}
                >
                  {processing ? 'Processing...' : `Pay Rs. ${amount.toFixed(2)}`}
                </button>
              </div>
            </form>
          )}

          {paymentMethod === 'WALLET' && (
            <form onSubmit={handlePayment}>
              <div className="payment-form">
                <div className="wallet-options">
                  <div className="wallet-option">
                    <input type="radio" name="wallet" id="paytm" defaultChecked />
                    <label htmlFor="paytm">Paytm</label>
                  </div>
                  <div className="wallet-option">
                    <input type="radio" name="wallet" id="phonepe" />
                    <label htmlFor="phonepe">PhonePe</label>
                  </div>
                  <div className="wallet-option">
                    <input type="radio" name="wallet" id="googlepay" />
                    <label htmlFor="googlepay">Google Pay</label>
                  </div>
                </div>
              </div>

              <div className="payment-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={onClose}
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="pay-btn"
                  disabled={processing}
                >
                  {processing ? 'Processing...' : `Pay Rs. ${amount.toFixed(2)}`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
