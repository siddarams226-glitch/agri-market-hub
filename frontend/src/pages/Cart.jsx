import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { Trash2, ShoppingCart } from 'lucide-react';

const Cart = () => {
  const { items, total, loading, fetchCart, updateCartQuantity, removeFromCart } = useCart();
  const [removing, setRemoving] = useState(null);
  const [shippingAddress, setShippingAddress] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (cartId) => {
    setRemoving(cartId);
    try {
      await removeFromCart(cartId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setRemoving(null);
    }
  };

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      setMessage('Please enter shipping address');
      return;
    }

    setOrdering(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ shipping_address: shippingAddress })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setMessage('Order placed successfully!');
      setTimeout(() => navigate('/orders'), 2000);
    } catch (error) {
      setMessage(error.message || 'Failed to place order');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}

        {items.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-6 border-b last:border-b-0">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-gray-600 text-sm">By: {item.farmer_name}</p>
                      <p className="text-green-600 font-semibold">₹{item.price} each</p>
                    </div>
                    <div className="flex items-center gap-2 border rounded-lg">
                      <button
                        onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="px-4 py-1">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, Math.min(item.available_quantity, item.quantity + 1))}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right min-w-[100px]">
                      <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => handleRemove(item.id)}
                        disabled={removing === item.id}
                        className="text-red-500 hover:text-red-700 mt-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 h-fit">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span className="font-semibold">₹0</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 text-xl">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-green-600">₹{total.toFixed(2)}</span>
              </div>

              <div className="form-group mb-6">
                <label>Shipping Address</label>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Enter your complete address"
                  className="min-h-24"
                />
              </div>

              <button
                onClick={handleCheckout}
                disabled={ordering || items.length === 0}
                className="w-full btn btn-primary flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                {ordering ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started</p>
            <button
              onClick={() => navigate('/products')}
              className="btn btn-primary"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
