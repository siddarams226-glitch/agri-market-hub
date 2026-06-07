import { useEffect, useState } from 'react';
import api from '../utils/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { Package, X } from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data.data.orders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    setCancelling(orderId);
    try {
      await api.put(`/orders/${orderId}/cancel`);
      setOrders(orders.map(o => o.id === orderId ? { ...o, order_status: 'cancelled' } : o));
    } catch (error) {
      console.error('Failed to cancel order:', error);
      alert(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(null);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Order History</h1>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Order ID</p>
                    <p className="font-bold text-lg">#{order.id}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.order_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    order.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.order_status.toUpperCase()}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4 pb-4 border-b">
                  <div>
                    <p className="text-gray-600 text-sm">Order Date</p>
                    <p className="font-semibold">{new Date(order.order_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Total Amount</p>
                    <p className="font-bold text-green-600 text-lg">₹{order.total_amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Shipping Address</p>
                    <p className="text-sm">{order.shipping_address.substring(0, 50)}...</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="btn btn-outline"
                  >
                    View Details
                  </button>
                  {order.order_status === 'pending' && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      disabled={cancelling === order.id}
                      className="btn btn-danger"
                    >
                      {cancelling === order.id ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-600">Start shopping to place your first order</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-2xl font-bold">Order #{selectedOrder.id} Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <p className="mb-4"><strong>Status:</strong> {selectedOrder.order_status.toUpperCase()}</p>
              <p className="mb-4"><strong>Total:</strong> ₹{selectedOrder.total_amount.toFixed(2)}</p>
              <p className="mb-6"><strong>Address:</strong> {selectedOrder.shipping_address}</p>

              {selectedOrder.items && (
                <div>
                  <h3 className="font-bold mb-4">Items Ordered:</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
