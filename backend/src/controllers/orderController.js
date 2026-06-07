import pool from '../config/database.js';

export const createOrder = async (req, res) => {
  try {
    const buyerId = req.user.userId;
    const { shipping_address } = req.body;

    const connection = await pool.getConnection();

    // Get cart items
    const [cartItems] = await connection.query(
      `SELECT c.id, c.quantity, p.id as product_id, p.price, p.quantity as available_quantity
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.buyer_id = ?`,
      [buyerId]
    );

    if (cartItems.length === 0) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Calculate total
    let total = 0;
    for (const item of cartItems) {
      if (item.quantity > item.available_quantity) {
        connection.release();
        return res.status(400).json({
          success: false,
          message: `${item.product_id} has insufficient quantity`
        });
      }
      total += item.price * item.quantity;
    }

    // Create order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (buyer_id, total_amount, shipping_address) VALUES (?, ?, ?)',
      [buyerId, total, shipping_address]
    );

    const orderId = orderResult.insertId;

    // Add order items and reduce product quantities
    for (const item of cartItems) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );

      await connection.query(
        'UPDATE products SET quantity = quantity - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await connection.query('DELETE FROM cart WHERE buyer_id = ?', [buyerId]);

    connection.release();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId,
        total: parseFloat(total.toFixed(2)),
        itemCount: cartItems.length,
        orderStatus: 'pending'
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const buyerId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const connection = await pool.getConnection();

    const [orders] = await connection.query(
      `SELECT id, total_amount, order_status, shipping_address, order_date, delivered_date
       FROM orders
       WHERE buyer_id = ?
       ORDER BY order_date DESC
       LIMIT ? OFFSET ?`,
      [buyerId, parseInt(limit), offset]
    );

    const [countResult] = await connection.query(
      'SELECT COUNT(*) as count FROM orders WHERE buyer_id = ?',
      [buyerId]
    );

    connection.release();

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          total: countResult[0].count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(countResult[0].count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const buyerId = req.user.userId;
    const { orderId } = req.params;

    const connection = await pool.getConnection();

    // Verify order belongs to buyer
    const [orders] = await connection.query(
      `SELECT id, total_amount, order_status, shipping_address, order_date, delivered_date
       FROM orders
       WHERE id = ? AND buyer_id = ?`,
      [orderId, buyerId]
    );

    if (orders.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Get order items
    const [orderItems] = await connection.query(
      `SELECT oi.id, oi.product_id, oi.quantity, oi.price, p.name, p.image_url, p.category
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    connection.release();

    res.json({
      success: true,
      data: {
        order: {
          ...orders[0],
          items: orderItems
        }
      }
    });
  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details',
      error: error.message
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const buyerId = req.user.userId;
    const { orderId } = req.params;

    const connection = await pool.getConnection();

    // Verify order belongs to buyer and can be cancelled
    const [orders] = await connection.query(
      'SELECT id, order_status FROM orders WHERE id = ? AND buyer_id = ?',
      [orderId, buyerId]
    );

    if (orders.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (orders[0].order_status !== 'pending') {
      connection.release();
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${orders[0].order_status}`
      });
    }

    // Get order items to restore quantities
    const [orderItems] = await connection.query(
      'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
      [orderId]
    );

    // Restore product quantities
    for (const item of orderItems) {
      await connection.query(
        'UPDATE products SET quantity = quantity + ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Update order status
    await connection.query(
      'UPDATE orders SET order_status = ? WHERE id = ?',
      ['cancelled', orderId]
    );

    connection.release();

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};

// Farmer endpoint to get orders for their products
export const getFarmerOrders = async (req, res) => {
  try {
    const farmerId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const connection = await pool.getConnection();

    const [orders] = await connection.query(
      `SELECT DISTINCT o.id, o.buyer_id, o.total_amount, o.order_status, o.order_date,
              u.name as buyer_name, u.email as buyer_email, u.phone as buyer_phone
       FROM orders o
       JOIN users u ON o.buyer_id = u.id
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE p.farmer_id = ?
       ORDER BY o.order_date DESC
       LIMIT ? OFFSET ?`,
      [farmerId, parseInt(limit), offset]
    );

    const [countResult] = await connection.query(
      `SELECT COUNT(DISTINCT o.id) as count
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE p.farmer_id = ?`,
      [farmerId]
    );

    connection.release();

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          total: countResult[0].count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(countResult[0].count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get farmer orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};
