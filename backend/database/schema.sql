-- Agri Market Hub Database Schema
-- MySQL 8.0+

-- Create Database
CREATE DATABASE IF NOT EXISTS agri_market_hub;
USE agri_market_hub;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('farmer', 'buyer') NOT NULL,
  phone VARCHAR(15),
  address TEXT,
  city VARCHAR(50),
  state VARCHAR(50),
  pin_code VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL CHECK (quantity >= 0),
  image_url VARCHAR(500),
  farmer_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_farmer_id (farmer_id),
  INDEX idx_category (category),
  FULLTEXT INDEX idx_search (name, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cart Table
CREATE TABLE IF NOT EXISTS cart (
  id INT PRIMARY KEY AUTO_INCREMENT,
  buyer_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_item (buyer_id, product_id),
  INDEX idx_buyer_id (buyer_id),
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  buyer_id INT NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  order_status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  shipping_address TEXT,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  delivered_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_buyer_id (buyer_id),
  INDEX idx_order_status (order_status),
  INDEX idx_order_date (order_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  INDEX idx_order_id (order_id),
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Data
INSERT INTO users (name, email, password, role, phone, address, city, state, pin_code) VALUES
('Rajesh Kumar', 'rajesh@farmer.com', '$2b$10$Y1qiIktWNPqKxqKKkK9hCOxZVi8xPdKxZfJe4KJK3rKkK9hCOxZVi', 'farmer', '9876543210', '123 Farm Lane', 'Punjab', 'Punjab', '141001'),
('Amit Patel', 'amit@buyer.com', '$2b$10$Y1qiIktWNPqKxqKKkK9hCOxZVi8xPdKxZfJe4KJK3rKkK9hCOxZVi', 'buyer', '9123456789', '456 City Road', 'Mumbai', 'Maharashtra', '400001'),
('Priya Singh', 'priya@farmer.com', '$2b$10$Y1qiIktWNPqKxqKKkK9hCOxZVi8xPdKxZfJe4KJK3rKkK9hCOxZVi', 'farmer', '9988776655', '789 Green Fields', 'Haryana', 'Haryana', '121001'),
('Suresh Gupta', 'suresh@buyer.com', '$2b$10$Y1qiIktWNPqKxqKKkK9hCOxZVi8xPdKxZfJe4KJK3rKkK9hCOxZVi', 'buyer', '8765432109', '321 Main Street', 'Delhi', 'Delhi', '110001');

INSERT INTO products (name, description, category, price, quantity, farmer_id, image_url) VALUES
('Fresh Tomatoes', 'Juicy red tomatoes from organic farms', 'vegetables', 45.00, 100, 1, 'https://via.placeholder.com/300?text=Tomatoes'),
('Green Peppers', 'Fresh green peppers cultivated without pesticides', 'vegetables', 60.00, 80, 1, 'https://via.placeholder.com/300?text=Green+Peppers'),
('Wheat Grains', 'Premium quality wheat for flour', 'grains', 25.00, 500, 3, 'https://via.placeholder.com/300?text=Wheat'),
('Organic Rice', 'Aromatic basmati rice', 'grains', 80.00, 200, 3, 'https://via.placeholder.com/300?text=Rice'),
('Apple Fruits', 'Sweet and crispy apples from Kashmir', 'fruits', 120.00, 150, 1, 'https://via.placeholder.com/300?text=Apples'),
('Banana Bunch', 'Yellow and ripe bananas', 'fruits', 40.00, 200, 3, 'https://via.placeholder.com/300?text=Banana'),
('Spinach Leaves', 'Fresh green spinach leaves', 'vegetables', 35.00, 120, 1, 'https://via.placeholder.com/300?text=Spinach'),
('Potato Sacks', 'High quality potatoes', 'vegetables', 30.00, 300, 3, 'https://via.placeholder.com/300?text=Potatoes');

-- Create indexes for performance
CREATE INDEX idx_products_farmer ON products(farmer_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_cart_buyer ON cart(buyer_id);

-- Create view for farmer sales summary
CREATE VIEW farmer_sales_summary AS
SELECT 
  u.id,
  u.name,
  COUNT(DISTINCT o.id) as total_orders,
  SUM(oi.quantity) as total_items_sold,
  SUM(oi.price * oi.quantity) as total_revenue
FROM users u
LEFT JOIN products p ON u.id = p.farmer_id
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id
WHERE u.role = 'farmer'
GROUP BY u.id, u.name;
