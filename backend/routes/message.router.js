import { Router } from 'express';
import {
    getAll,
    getUserMessages,
    addMessage
} from '../controllers/message.controller.js';

const router = Router();

/******************************************** GET ********************************************/

// Get all messages
router.get('/', getAll);

// Get all messages from one user based on email
router.get('/:email', getUserMessages);

/******************************************** POST *******************************************/

// Add message
router.post('/', addMessage);

/******************************************* UPDATE ******************************************/

/******************************************* DELETE ******************************************/

export default router;