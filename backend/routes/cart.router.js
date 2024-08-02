import { Router } from 'express';
import {
    getAllCarts,
    getAllFromCart,
    create,
    addProductToCart,
    confirmCartProducts,
    deleteCart,
    deleteFromCart
} from '../controllers/cart.controller.js';

const router = Router();

/******************************************** POST ********************************************/

// Create new cart
router.post('/', create);

// Add product to cart
router.post('/:id/productos', addProductToCart);

// Confirm products from cart
router.post('/:id', confirmCartProducts);

/******************************************** GET ********************************************/

// Get all products from cart
router.get('/', getAllCarts);

// Get all products from cart
router.get('/:id/productos', getAllFromCart);

/******************************************* UPDATE ******************************************/

/******************************************* DELETE ******************************************/

// Delete cart
router.delete('/:id', deleteCart);

// Delete product from cart
router.delete('/:idCart/productos/:idProduct', deleteFromCart);

export default router;