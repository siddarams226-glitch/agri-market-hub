import pool from '../config/database.js';

export const getCart = async (req, res) => {
  try {
    const buyerId = req.user.userId;

    const connection = await pool.getConnection();
    const [cartItems] = await connection.query(
      `SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image_url, 
              p.quantity as available_quantity, u.name as farmer_name
       FROM cart c
       JOIN products p ON c.product_id = p.id
       JOIN users u ON p.farmer_id = u.id
       WHERE c.buyer_id = ?
       ORDER BY c.added_at DESC`,
      [buyerId]
    );

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    connection.release();

    res.json({
      success: true,
      data: {
        items: cartItems,
        total: parseFloat(total.toFixed(2)),
        itemCount: cartItems.length
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error.message
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const buyerId = req.user.userId;
    const { product_id, quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0'
      });
    }

    const connection = await pool.getConnection();

    // Verify product exists and has enough quantity
    const [products] = await connection.query(
      'SELECT id, quantity FROM products WHERE id = ?',
      [product_id]
    );

    if (products.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (products[0].quantity < quantity) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: `Only ${products[0].quantity} units available`
      });
    }

    // Check if item already in cart
    const [existingCart] = await connection.query(
      'SELECT id, quantity FROM cart WHERE buyer_id = ? AND product_id = ?',
      [buyerId, product_id]
    );

    if (existingCart.length > 0) {
      // Update quantity
      const newQuantity = existingCart[0].quantity + quantity;
      if (newQuantity > products[0].quantity) {
        connection.release();
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Only ${products[0].quantity} units available`
        });
      }
      await connection.query(
        'UPDATE cart SET quantity = ? WHERE id = ?',
        [newQuantity, existingCart[0].id]
      );
    } else {
      // Insert new cart item
      await connection.query(
        'INSERT INTO cart (buyer_id, product_id, quantity) VALUES (?, ?, ?)',
        [buyerId, product_id, quantity]
      );
    }

    const [cartItem] = await connection.query(
      `SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image_url
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.buyer_id = ? AND c.product_id = ?`,
      [buyerId, product_id]
    );

    connection.release();

    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      data: cartItem[0]
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to cart',
      error: error.message
    });
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const buyerId = req.user.userId;
    const { cart_id } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0'
      });
    }

    const connection = await pool.getConnection();

    // Verify cart item belongs to buyer
    const [cartItems] = await connection.query(
      'SELECT cart.id, cart.product_id FROM cart WHERE id = ? AND buyer_id = ?',
      [cart_id, buyerId]
    );

    if (cartItems.length === 0) {
      connection.release();
      return res.status(403).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Verify product has enough quantity
    const [products] = await connection.query(
      'SELECT quantity FROM products WHERE id = ?',
      [cartItems[0].product_id]
    );

    if (products[0].quantity < quantity) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: `Only ${products[0].quantity} units available`
      });
    }

    await connection.query(
      'UPDATE cart SET quantity = ? WHERE id = ?',
      [quantity, cart_id]
    );

    const [updatedCart] = await connection.query(
      `SELECT c.id, c.quantity, p.id as product_id, p.name, p.price
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.id = ?`,
      [cart_id]
    );

    connection.release();

    res.json({
      success: true,
      message: 'Cart updated successfully',
      data: updatedCart[0]
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart',
      error: error.message
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const buyerId = req.user.userId;
    const { cart_id } = req.params;

    const connection = await pool.getConnection();

    // Verify cart item belongs to buyer
    const [cartItems] = await connection.query(
      'SELECT id FROM cart WHERE id = ? AND buyer_id = ?',
      [cart_id, buyerId]
    );

    if (cartItems.length === 0) {
      connection.release();
      return res.status(403).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    await connection.query('DELETE FROM cart WHERE id = ?', [cart_id]);

    connection.release();

    res.json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from cart',
      error: error.message
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const buyerId = req.user.userId;

    const connection = await pool.getConnection();
    await connection.query('DELETE FROM cart WHERE buyer_id = ?', [buyerId]);
    connection.release();

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
};
