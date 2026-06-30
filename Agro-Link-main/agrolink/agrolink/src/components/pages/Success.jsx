import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('confirming');

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId) {
        setStatus('confirmed');
        return;
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/payment/confirm-checkout-session`, { sessionId });
        setStatus(response.data.paymentStatus === 'paid' ? 'paid' : 'confirmed');
      } catch (error) {
        setStatus('confirmed');
      }
    };

    confirmPayment();
  }, [sessionId]);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>✅ Payment Successful!</h1>
      <p>
        {status === 'confirming'
          ? 'Confirming your payment...'
          : status === 'paid'
            ? 'Thank you for your purchase. Your order has been confirmed.'
            : 'Your order has been received and will be confirmed shortly.'}
      </p>
    </div>
  );
};

export default Success;
