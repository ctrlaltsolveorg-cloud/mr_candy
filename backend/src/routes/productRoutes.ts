import { Router } from 'express';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  addWholesaleStock,
  deductWholesaleStock,
} from '../controllers/productController';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

// Public/User: View products
router.get('/', getAllProducts);

// Admin: Create/Update products
router.post('/', upload.single('photo'), createProduct);
router.put('/:id', upload.single('photo'), updateProduct);

// Mother/Admin: Inventory management
router.post('/:id/add-stock', addWholesaleStock);
router.post('/:id/deduct-stock', deductWholesaleStock);

export default router;
