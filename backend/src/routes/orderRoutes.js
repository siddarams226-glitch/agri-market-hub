import express from 'express';
import { body, param, query } from 'express-validator';
import {
  createOrder,
  getUserOrders,
  getOrderDetails,
  cancelOrder,
  getFarmerOrders
} from '../controllers/orderController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Buyer routes
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['buyer']),
  [
    body('shipping_address').trim().notEmpty().withMessage('Shipping address is required')
  ],
  handleValidationErrors,
  createOrder
);

router.get(
  '/',
  authMiddleware,
  roleMiddleware(['buyer']),
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
  ],
  handleValidationErrors,
  getUserOrders
);

router.get(
  '/:orderId',
  authMiddleware,
  roleMiddleware(['buyer']),
  [param('orderId').isInt().toInt()],
  handleValidationErrors,
  getOrderDetails
);

router.put(
  '/:orderId/cancel',
  authMiddleware,
  roleMiddleware(['buyer']),
  [param('orderId').isInt().toInt()],
  handleValidationErrors,
  cancelOrder
);

// Farmer routes - get orders for their products
router.get(
  '/farmer/orders/list',
  authMiddleware,
  roleMiddleware(['farmer']),
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
  ],
  handleValidationErrors,
  getFarmerOrders
);

export default router;
