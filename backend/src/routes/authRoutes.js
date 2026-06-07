import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  refreshToken,
  getUserProfile,
  updateUserProfile
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),
    body('role').isIn(['farmer', 'buyer']).withMessage('Role must be farmer or buyer'),
    body('phone').optional().isMobilePhone().withMessage('Valid phone number required')
  ],
  handleValidationErrors,
  register
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  handleValidationErrors,
  login
);

// Refresh Token
router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);

export default router;
