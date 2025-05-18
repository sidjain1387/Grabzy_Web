// src/context/AppContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import API from '../api/api_with_auth';
import { useNavigate } from 'react-router-dom';
import API_with_auth from '../api/api_with_auth';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }
      console.log('Token found:', token);

      try {
        const cartRes = await API_with_auth.get('/cart/get');
        setCartId(cartRes.data.cart_id);
        console.log('Cart ID:', cartRes.data.cart_id);

      } catch (err) {
        console.error('Auth or cart setup failed:', err);
        localStorage.removeItem('token');
        navigate('/signin');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  return (
    <AppContext.Provider value={{ cartId, loading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
