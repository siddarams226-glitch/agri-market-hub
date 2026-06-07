import { createContext, useContext, useReducer, useCallback } from 'react';
import api from '../utils/api';

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
  error: null,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'CART_START':
      return { ...state, loading: true, error: null };
    case 'CART_SET':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        itemCount: action.payload.itemCount,
        loading: false,
      };
    case 'CART_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_CART':
      return { ...initialState };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const fetchCart = useCallback(async () => {
    dispatch({ type: 'CART_START' });
    try {
      const response = await api.get('/cart');
      dispatch({
        type: 'CART_SET',
        payload: response.data.data,
      });
    } catch (error) {
      dispatch({
        type: 'CART_ERROR',
        payload: error.response?.data?.message || 'Failed to fetch cart',
      });
    }
  }, []);

  const addToCart = useCallback(async (productId, quantity) => {
    try {
      await api.post('/cart/add', { product_id: productId, quantity });
      await fetchCart();
    } catch (error) {
      throw error;
    }
  }, [fetchCart]);

  const updateCartQuantity = useCallback(async (cartId, quantity) => {
    try {
      await api.put(`/cart/${cartId}`, { quantity });
      await fetchCart();
    } catch (error) {
      throw error;
    }
  }, [fetchCart]);

  const removeFromCart = useCallback(async (cartId) => {
    try {
      await api.delete(`/cart/${cartId}`);
      await fetchCart();
    } catch (error) {
      throw error;
    }
  }, [fetchCart]);

  const clearCart = useCallback(async () => {
    try {
      await api.delete('/cart');
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      throw error;
    }
  }, []);

  const value = {
    items: state.items,
    total: state.total,
    itemCount: state.itemCount,
    loading: state.loading,
    error: state.error,
    fetchCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
