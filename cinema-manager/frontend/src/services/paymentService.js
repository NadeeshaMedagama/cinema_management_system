import api from './api';

const paymentService = {
  // Get Stripe configuration (public key)
  getStripeConfig: async () => {
    try {
      const response = await api.get('/payments/config');
      return response.data;
    } catch (error) {
      console.error('Error fetching Stripe config:', error);
      throw error;
    }
  },

  // Create Stripe Payment Intent
  createPaymentIntent: async (amount, currency = 'usd') => {
    try {
      const response = await api.post('/payments/create-payment-intent', {
        amount,
        currency
      });
      return response.data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  },

  // Create a new payment
  createPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/create', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  // Process payment with payment method
  processPayment: async (paymentId, paymentMethod, paymentIntentId = null) => {
    try {
      const requestData = { paymentMethod };
      if (paymentIntentId) {
        requestData.paymentIntentId = paymentIntentId;
      }
      const response = await api.post(`/payments/process/${paymentId}`, requestData);
      return response.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  },

  // Get payment by ID
  getPayment: async (paymentId) => {
    try {
      const response = await api.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
    }
  },

  // Get user's payment history
  getUserPayments: async (userId) => {
    try {
      const response = await api.get(`/payments/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user payments:', error);
      throw error;
    }
  },

  // Get payments for a booking
  getBookingPayments: async (bookingId) => {
    try {
      const response = await api.get(`/payments/booking/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking payments:', error);
      throw error;
    }
  },

  // Refund a payment
  refundPayment: async (paymentId) => {
    try {
      const response = await api.post(`/payments/refund/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw error;
    }
  }
};

export default paymentService;
