import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Menu, X, ShoppingCart, LogOut } from 'lucide-react';
import { useState } from 'react';

const Navigation = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-green-600 text-white p-2 rounded-lg font-bold">AMH</div>
            <span className="font-bold text-lg hidden sm:inline">Agri Market Hub</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-green-600 transition">Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-green-600 transition">Products</Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'buyer' && (
                  <>
                    <Link to="/cart" className="relative">
                      <ShoppingCart className="text-gray-700 hover:text-green-600 transition" size={24} />
                      {itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {itemCount}
                        </span>
                      )}
                    </Link>
                    <Link to="/orders" className="text-gray-700 hover:text-green-600 transition">My Orders</Link>
                  </>
                )}

                {user?.role === 'farmer' && (
                  <>
                    <Link to="/farmer/dashboard" className="text-gray-700 hover:text-green-600 transition">Dashboard</Link>
                    <Link to="/farmer/orders" className="text-gray-700 hover:text-green-600 transition">Orders</Link>
                  </>
                )}

                <Link to="/profile" className="text-gray-700 hover:text-green-600 transition">Profile</Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-green-600 transition">Login</Link>
                <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Register</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-gray-50 py-4 space-y-3 border-t">
            <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Home</Link>
            <Link to="/products" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Products</Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'buyer' && (
                  <>
                    <Link to="/cart" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Cart {itemCount > 0 && `(${itemCount})`}
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">My Orders</Link>
                  </>
                )}

                {user?.role === 'farmer' && (
                  <>
                    <Link to="/farmer/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Dashboard</Link>
                    <Link to="/farmer/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Orders</Link>
                  </>
                )}

                <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Login</Link>
                <Link to="/register" className="block px-4 py-2 bg-green-600 text-white hover:bg-green-700">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
