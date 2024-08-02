import orderService from '../services/order.service.js';
import { variables } from '../config/config.js';
import logger from '../logs/logger.js';

const STATUS = variables.STATUS;

// Search order based on ID
export async function searchOrder(req, res) {
    try {
        const id = req.params.id;
        const order = await orderService.getById(id);
        if (!order) {
            logger.logWarn(req, res, STATUS.NOT_FOUND);
            return res.status(STATUS.NOT_FOUND).json('Order not found.');
        }
        res.status(STATUS.OK).json(order);
    } catch (e) {
        console.log(e.message);
        logger.logError(req, res, STATUS.INTERNAL_SERVER_ERROR);
        res.status(STATUS.INTERNAL_SERVER_ERROR).end();
    }
}

// Get all orders
export async function getAll(req, res) {
    try {
        if (req.user.admin) {
            const orders = await orderService.getAll();
            res.status(STATUS.OK).json(orders);
        }
        else {
            let message = {
                error: -1,
                route: 'localhost:8080/api/ordenes',
                method: 'GET',
                status: 'Unauthorized'
            }
            logger.logWarn(req, res, STATUS.UNAUTHORIZED);
            res.status(STATUS.UNAUTHORIZED).json(message);
        }
    } catch (e) {
        console.log(e.message);
        logger.logError(req, res, STATUS.INTERNAL_SERVER_ERROR);
        res.status(STATUS.INTERNAL_SERVER_ERROR).end();
    }
}

// Delete order based on ID
export async function deleteOrder(req, res) {
    try {
        if (req.user.admin) {
            let id = req.params.id;
            let succeed = await orderService.deleteOne(id);

            if (succeed > 0) { res.status(STATUS.ACCEPTED).end(); }
            else {
                logger.logWarn(req, res, STATUS.NOT_FOUND);
                res.status(STATUS.NOT_FOUND).json('Order not found.');
            }
        }
        else {
            let message = {
                error: -1,
                route: 'localhost:8080/api/ordenes/:id',
                method: 'DELETE',
                status: 'Unauthorized'
            }
            res.status(STATUS.UNAUTHORIZED).json(message);
            logger.logWarn(req, res, STATUS.UNAUTHORIZED);
        }
    }
    catch (e) {
        console.log(e.message);
        logger.logError(req, res, STATUS.INTERNAL_SERVER_ERROR);
        res.status(STATUS.INTERNAL_SERVER_ERROR).end();
    }
}