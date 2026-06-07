import pool from '../config/database.js';

export const getAllProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const connection = await pool.getConnection();
    let query = `
      SELECT p.*, u.name as farmer_name, u.phone as farmer_phone
      FROM products p
      JOIN users u ON p.farmer_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += ' AND p.category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [products] = await connection.query(query, params);

    const [countResult] = await connection.query(
      'SELECT COUNT(*) as count FROM products WHERE 1=1' +
      (category ? ' AND category = ?' : '') +
      (search ? ' AND (name LIKE ? OR description LIKE ?)' : ''),
      params.slice(0, params.length - 2)
    );

    connection.release();

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total: countResult[0].count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(countResult[0].count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [products] = await connection.query(
      `SELECT p.*, u.name as farmer_name, u.phone as farmer_phone, u.email as farmer_email
       FROM products p
       JOIN users u ON p.farmer_id = u.id
       WHERE p.id = ?`,
      [id]
    );

    connection.release();

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: products[0]
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const farmerId = req.user.userId;
    const { name, description, category, price, quantity, image_url } = req.body;

    const connection = await pool.getConnection();
    
    // Verify farmer exists
    const [farmer] = await connection.query(
      'SELECT id FROM users WHERE id = ? AND role = ?',
      [farmerId, 'farmer']
    );

    if (farmer.length === 0) {
      connection.release();
      return res.status(403).json({
        success: false,
        message: 'Only farmers can create products'
      });
    }

    const [result] = await connection.query(
      'INSERT INTO products (name, description, category, price, quantity, image_url, farmer_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, category, price, quantity, image_url, farmerId]
    );

    connection.release();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        id: result.insertId,
        name,
        description,
        category,
        price,
        quantity,
        image_url,
        farmer_id: farmerId
      }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const farmerId = req.user.userId;
    const { name, description, category, price, quantity, image_url } = req.body;

    const connection = await pool.getConnection();

    // Verify product exists and belongs to farmer
    const [products] = await connection.query(
      'SELECT id FROM products WHERE id = ? AND farmer_id = ?',
      [id, farmerId]
    );

    if (products.length === 0) {
      connection.release();
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this product'
      });
    }

    await connection.query(
      'UPDATE products SET name = ?, description = ?, category = ?, price = ?, quantity = ?, image_url = ? WHERE id = ?',
      [name, description, category, price, quantity, image_url, id]
    );

    const [updatedProduct] = await connection.query(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    connection.release();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct[0]
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const farmerId = req.user.userId;

    const connection = await pool.getConnection();

    // Verify product exists and belongs to farmer
    const [products] = await connection.query(
      'SELECT id FROM products WHERE id = ? AND farmer_id = ?',
      [id, farmerId]
    );

    if (products.length === 0) {
      connection.release();
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this product'
      });
    }

    await connection.query('DELETE FROM products WHERE id = ?', [id]);

    connection.release();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

export const getFarmerProducts = async (req, res) => {
  try {
    const farmerId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const connection = await pool.getConnection();
    
    const [products] = await connection.query(
      'SELECT * FROM products WHERE farmer_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [farmerId, parseInt(limit), offset]
    );

    const [countResult] = await connection.query(
      'SELECT COUNT(*) as count FROM products WHERE farmer_id = ?',
      [farmerId]
    );

    connection.release();

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total: countResult[0].count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(countResult[0].count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get farmer products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};
