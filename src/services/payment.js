import axios from 'axios';

export const initiatePayment = async (amount, orderId, email) => {
  const response = await axios.post('/api/payments/pay', {
    amount,
    orderId,
    email,
  });
  return response;
};

export const verifyPayment = async (reference) => {
  const response = await axios.post('/api/payments/verify', { reference });
  return response;
};
