import { Router } from 'express';
import productRouter from './product.router.js';
import cartRouter from './cart.router.js'
import userRouter from './user.router.js';
import orderRouter from './order.router.js';
import messageRouter from './message.router.js';
import { verifyAuth } from '../controllers/user.controller.js';

const router = Router();

router.use('/api/productos', verifyAuth, productRouter);
router.use('/api/carrito', verifyAuth, cartRouter);
router.use('/api/ordenes', verifyAuth, orderRouter);
router.use('/messages', verifyAuth, messageRouter);
router.use('/usuarios', userRouter);

export default router;