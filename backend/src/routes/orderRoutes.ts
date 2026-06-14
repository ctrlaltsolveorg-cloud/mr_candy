import { Router } from 'express';
import {
  createOrder,
  getOrders,
  acceptOrder,
  completeOrder,
} from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { Role } from '@prisma/client';

const router = Router();

// Temporarily using a hardcoded customerId since auth is removed
router.post('/', (req, res, next) => {
  // Use a default customer ID if none provided
  if (!req.body.customerId) {
    req.body.customerId = 'default-customer-id'; 
  }
  next();
}, createOrder);

router.get('/', getOrders);
router.post('/:id/accept', acceptOrder);
router.post('/:id/complete', completeOrder);

export default router;
