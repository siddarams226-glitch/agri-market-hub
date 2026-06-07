import { useEffect, useState } from 'react';
import api from '../../utils/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { Package, X } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/farmer/orders/list');
        setOrders(response.data.data.orders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Orders for My Products</h1>

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

                <div className="grid md:grid-cols-4 gap-4 mb-4 pb-4 border-b">
                  <div>
                    <p className="text-gray-600 text-sm">Buyer Name</p>
                    <p className="font-semibold">{order.buyer_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Buyer Email</p>
                    <p className="font-semibold text-sm">{order.buyer_email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Phone</p>
                    <p className="font-semibold">{order.buyer_phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Order Date</p>
                    <p className="font-semibold">{new Date(order.order_date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mb-4 pb-4 border-b">
                  <p className="text-gray-600 text-sm mb-2">Order Total</p>
                  <p className="font-bold text-2xl text-green-600">₹{order.total_amount.toFixed(2)}</p>
                </div>

                <button
                  onClick={() => setSelectedOrder(order)}
                  className="btn btn-outline"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-600">When buyers purchase your products, orders will appear here</p>
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
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-600 text-sm">Buyer</p>
                  <p className="font-bold">{selectedOrder.buyer_name}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.buyer_email}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Status</p>
                  <p className="font-bold">{selectedOrder.order_status.toUpperCase()}</p>
                </div>
              </div>

              <p className="mb-4"><strong>Total:</strong> ₹{selectedOrder.total_amount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
