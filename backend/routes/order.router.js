import { Router } from 'express';
import {
    getAll,
    searchOrder,
    deleteOrder
} from '../controllers/order.controller.js';

const router = Router();

/******************************************** GET ********************************************/

// Get all orders confirmed
router.get('/', getAll);

// Get order based on ID
router.get('/:id', searchOrder);

/******************************************* UPDATE ******************************************/

/******************************************* DELETE ******************************************/

// Delete order
router.delete('/:id', deleteOrder);

export default router;