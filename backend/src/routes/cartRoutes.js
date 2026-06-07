import express from 'express';
import { body, param } from 'express-validator';
import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// All cart routes require authentication and buyer role
router.use(authMiddleware, roleMiddleware(['buyer']));

// Get cart
router.get('/', getCart);

// Add to cart
router.post(
  '/add',
  [
    body('product_id').isInt({ min: 1 }).toInt().withMessage('Valid product ID is required'),
    body('quantity').isInt({ min: 1 }).toInt().withMessage('Quantity must be at least 1')
  ],
  handleValidationErrors,
  addToCart
);

// Update cart quantity
router.put(
  '/:cart_id',
  [
    param('cart_id').isInt().toInt(),
    body('quantity').isInt({ min: 1 }).toInt().withMessage('Quantity must be at least 1')
  ],
  handleValidationErrors,
  updateCartQuantity
);

// Remove from cart
router.delete(
  '/:cart_id',
  [param('cart_id').isInt().toInt()],
  handleValidationErrors,
  removeFromCart
);

// Clear cart
router.delete('/', clearCart);

export default router;
