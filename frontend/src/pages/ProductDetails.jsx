import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'buyer') {
      setMessage('Only buyers can add items to cart');
      return;
    }

    setAdding(true);
    setMessage('');

    try {
      await addToCart(product.id, quantity);
      setMessage('Added to cart successfully!');
      setQuantity(1);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!product) return <div className="container mx-auto py-12"><p>Product not found</p></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-8"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

            {/* Farmer Info */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Farmer:</span> {product.farmer_name}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Contact:</span> {product.farmer_phone || 'N/A'}
              </p>
            </div>

            {/* Price and Stock */}
            <div className="flex items-center gap-8 mb-6">
              <div>
                <p className="text-gray-600 text-sm">Price</p>
                <p className="text-4xl font-bold text-green-600">₹{product.price}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">In Stock</p>
                <p className={`text-2xl font-bold ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.quantity}
                </p>
              </div>
            </div>

            {/* Category */}
            <p className="mb-6">
              <span className="text-gray-600">Category: </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                {product.category}
              </span>
            </p>

            {/* Description */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Add to Cart Section */}
            {product.quantity > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="font-semibold">Quantity:</label>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="px-6 py-2 border-l border-r">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={adding || !isAuthenticated}
                  className="w-full btn btn-primary flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  {adding ? 'Adding...' : 'Add to Cart'}
                </button>

                {!isAuthenticated && (
                  <p className="text-center text-gray-600 text-sm">
                    Please log in as a buyer to add items to cart
                  </p>
                )}
              </div>
            ) : (
              <button disabled className="w-full btn bg-gray-400 cursor-not-allowed">
                Out of Stock
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
