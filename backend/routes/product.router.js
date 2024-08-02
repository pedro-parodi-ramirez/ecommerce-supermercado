import { Router } from 'express';
import {
    addProduct,
    getAllProducts,
    getProductById,
    getProductsByCategory,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';

const router = Router();

/******************************************** POST ********************************************/

// Add product
router.post('/', addProduct)

/******************************************** GET ********************************************/

// Get all products
router.get('/', getAllProducts);

// Get by ID
router.get('/:idProduct', getProductById);

// Get by category
router.get('/categoria/:idCategory', getProductsByCategory);

/******************************************* UPDATE ******************************************/

// Update product by ID
router.put('/:id', updateProduct);

/******************************************* DELETE ******************************************/

// Delete product by ID
router.delete('/:id', deleteProduct);

export default router;