import express from 'express';
import { body, param, query } from 'express-validator';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFarmerProducts
} from '../controllers/productController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get(
  '/',
  [
    query('category').optional().trim(),
    query('search').optional().trim(),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
  ],
  handleValidationErrors,
  getAllProducts
);

router.get(
  '/:id',
  [param('id').isInt().toInt()],
  handleValidationErrors,
  getProductById
);

// Farmer routes
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['farmer']),
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').optional().trim(),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('price').isFloat({ min: 0 }).toFloat().withMessage('Valid price is required'),
    body('quantity').isInt({ min: 0 }).toInt().withMessage('Valid quantity is required'),
    body('image_url').optional().isURL().withMessage('Valid image URL required')
  ],
  handleValidationErrors,
  createProduct
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['farmer']),
  [
    param('id').isInt().toInt(),
    body('name').optional().trim().notEmpty().withMessage('Product name is required'),
    body('description').optional().trim(),
    body('category').optional().trim().notEmpty().withMessage('Category is required'),
    body('price').optional().isFloat({ min: 0 }).toFloat().withMessage('Valid price is required'),
    body('quantity').optional().isInt({ min: 0 }).toInt().withMessage('Valid quantity is required'),
    body('image_url').optional().isURL().withMessage('Valid image URL required')
  ],
  handleValidationErrors,
  updateProduct
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['farmer']),
  [param('id').isInt().toInt()],
  handleValidationErrors,
  deleteProduct
);

// Get farmer's products
router.get(
  '/farmer/my-products',
  authMiddleware,
  roleMiddleware(['farmer']),
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
  ],
  handleValidationErrors,
  getFarmerProducts
);

export default router;
