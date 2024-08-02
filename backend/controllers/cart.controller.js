import cartService from '../services/cart.service.js';
import orderService from '../services/order.service.js';
import { variables, config } from '../config/config.js';
import logger from '../logs/logger.js';
import sendMail from '../utils/nodemailer.js';

const STATUS = variables.STATUS;

export async function getAllCarts(req, res) {
    try {
        let carts = await cartService.getAll();
        res.status(STATUS.OK).json(carts);
    }
    catch (e) {
        console.log(e.message);
        logger.logError(req, res, STATUS.INTERNAL_SERVER_ERROR);
        res.status(STATUS.INTERNAL_SERVER_ERROR).end();
    }
}

export async function getAllFromCart(req, res) {
    try {
        let idCart = req.params.id;
        let cartProducts = await cartService.getAllFromCart(idCart);

        if (cartProducts || cartProducts.length === 0) { res.status(STATUS.OK).json(cartProducts); }
        else {
            logger.logWarn(req, res, STATUS.NOT_FOUND);
            res.status(STATUS.NOT_FOUND).json('Cart not found.');
        }
    }
    catch (e) {
        console.log(e.message);
        logger.logError(req, res, STATUS.INTERNAL_SERVER_ERROR);
        res.status(STATUS.INTERNAL_SERVER_ERROR).end();
    }
}

export async function create(req, res) {
    try {
        let id = await cartService.create({
            timestamp: Date.now(),
            products: []
        });
        res.status(STATUS.CREATED).json(id);
    }
    catch (e) {
        console.log(e.message);
        logger.logError(req, res, STATUS.INTERNAL_SERVER_ERROR);
        res.status(STATUS.INTERNAL_SERVER_ERROR).end();
    }
}

export async function addProductToCart(req, res) {
    try {
        let idCart = req.params.id;
        let product = req.body;
        const succeed = await cartService.addToCart(idCart, product);

        if (succeed) {
            // Respond products from updated cart
            const products = await cartService.getAllFromCart(idCart);
            res.status(STATUS.ACCEPTED).json(products);
        }
        else {
            logger.logWarn(req, res, STATUS.NOT_FOUND);
            res.status(STATUS.NOT_FOUND).json('Cart or product not found.');
        }
    }
    catch (e) {
        console.log(e.message);
        logger.logError(req, res, STATUS.INTERNAL_SERVER_ERROR);
        res.status(STATUS.INTERNAL_SERVER_ERROR).end();
    }
}

export async function confirmCartProducts(req, res) {
    try {
        let idCart = req.params.id;
        let cartProducts = await cartService.getAllFromCart(idCart);

        if (cartProducts.length === 0) {
            logger.logWarn(req, res, STATUS.BAD_REQUEST);
            res.status(STATUS.BAD_REQUEST).json('Cart is empty.');
        }
        else if (!cartProducts) {
            logger.logWarn(req, res, STATUS.NOT_FOUND);
            res.status(STATUS.NOT_FOUND).json('Cart not found.');
        }
        else {
            const newOrder = {
                user: {
                    name: req.user.name,
                    email: req.user.email
                },
                timestamp: Date.now(),
                products: cartProducts
            }

            // Order is stored and cart is deleted
            await orderService.store(newOrder)
            await cartService.deleteOne(idCart);

            // Email to administrator
            let subject = `Nuevo pedido de ${req.user.name} ${req.user.email}`;
            let body = 'Carrito de compras confirmado:\n' + JSON.stringify(cartProducts, null, 2);
            await sendMail(subject, body, config.ADMIN.EMAIL);

            res.status(STATUS.ACCEPTED).json('Order confirmed.');
        }
    }
    catch (e) {
        console.log(e.message);
        logger.logError(req, res, STATUS.INTERNAL_SERVER_ERROR);
        res.status(STATUS.INTERNAL_SERVER_ERROR).end();
    }
}

export async function deleteCart(req, res) {
    try {
        let id = req.params.id;
        let succeed = await cartService.deleteOne(id);

        if (succeed > 0) {
            res.status(STATUS.ACCEPTED).end();
        }
        else {
            logger.logWarn(req, res, STATUS.NOT_FOUND);
            res.status(STATUS.NOT_FOUND).json('Cart not found.');
        }
    }
    catch (e) {
        console.log(e.message);
        logger.logError(req, res, STATUS.INTERNAL_SERVER_ERROR);
        res.status(STATUS.INTERNAL_SERVER_ERROR).end();
    }
}

export async function deleteFromCart(req, res) {
    try {
        let idCart = req.params.idCart;
        let idProduct = req.params.idProduct;
        const succeed = await cartService.deleteFromCart(idCart, idProduct);

        if (succeed) {
            // Respond products from cart updated
            const products = await cartService.getAllFromCart(idCart);
            res.status(STATUS.ACCEPTED).json(products);
        }
        else {
            logger.logWarn(req, res, STATUS.NOT_FOUND);
            res.status(STATUS.NOT_FOUND).json('Cart or product not found.');
        }
    }
    catch (e) {
        console.log(e.message);
        logger.logError(req, res, STATUS.INTERNAL_SERVER_ERROR);
        res.status(STATUS.INTERNAL_SERVER_ERROR).end();
    }
}