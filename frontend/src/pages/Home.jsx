import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { Leaf, Users, ShoppingCart, TrendingUp } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.get('/products?limit=6');
        setProducts(response.data.data.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      {loading && <LoadingSpinner fullScreen />}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">Agri Market Hub</h1>
              <p className="text-xl mb-8 opacity-90">
                Connecting farmers directly to buyers. Fresh produce at fair prices, no middlemen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products" className="btn btn-outline text-white border-white hover:bg-white hover:text-green-600">
                  Browse Products
                </Link>
                <Link to="/register" className="btn bg-white text-green-600 hover:bg-gray-100">
                  Get Started
                </Link>
              </div>
            </div>
            <div className="hidden md:block text-center">
              <Leaf size={200} className="mx-auto opacity-80" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="card text-center">
              <Users size={48} className="mx-auto text-green-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Direct Connection</h3>
              <p className="text-gray-600">Connect directly with farmers or buyers without middlemen</p>
            </div>
            <div className="card text-center">
              <ShoppingCart size={48} className="mx-auto text-green-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Easy Trading</h3>
              <p className="text-gray-600">Simple and secure platform for buying and selling agriculture products</p>
            </div>
            <div className="card text-center">
              <TrendingUp size={48} className="mx-auto text-green-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Fair Prices</h3>
              <p className="text-gray-600">Get the best prices with transparent pricing</p>
            </div>
            <div className="card text-center">
              <Leaf size={48} className="mx-auto text-green-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Fresh Produce</h3>
              <p className="text-gray-600">Access to fresh, quality agricultural products</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Products</h2>
          {products.length > 0 ? (
            <div className="grid grid-2">
              {products.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`}>
                  <div className="card hover:shadow-lg transition cursor-pointer">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                      <span className="text-sm text-gray-500">Stock: {product.quantity}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No products available</p>
          )}
          <div className="text-center mt-12">
            <Link to="/products" className="btn btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of farmers and buyers on Agri Market Hub</p>
          <Link to="/register" className="btn bg-white text-green-600 hover:bg-gray-100">
            Register Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">About Us</h4>
              <p className="text-gray-400 text-sm">
                Agri Market Hub connects farmers directly to buyers for fresh, quality agricultural products.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/products" className="hover:text-white">Products</Link></li>
                <li><Link to="/register" className="hover:text-white">Register</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Buyers</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><Link to="/products" className="hover:text-white">Browse Products</Link></li>
                <li><Link to="/orders" className="hover:text-white">My Orders</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Farmers</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><Link to="/farmer/dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><Link to="/farmer/orders" className="hover:text-white">My Orders</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Agri Market Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
