import productService from '../services/product.service.js';
import { variables } from '../config/config.js';
import logger from '../logs/logger.js';

const STATUS = variables.STATUS;

/* Add product */
export async function addProduct(req, res) {
    try {
        if (req.user.admin) {
            const product = {
                name: req.body.name,
                description: req.body.description,
                cathegory: {
                    id: parseInt(req.body.cathegory.id),
                    name: req.body.cathegory.name
                },
                image: req.body.image,
                price: parseFloat(parseFloat(req.body.price).toFixed(2)),
                stock: parseInt(req.body.stock)
            }

            const response = await productService.create(product);
            res.status(STATUS.CREATED).json(response);
        }
        else {
            let message = {
                error: -1,
                route: 'localhost:8080/api/productos',
                method: 'POST',
                status: 'Unauthorized'
            }
            logger.logWarn(req, res, STATUS.UNAUTHORIZED);
            res.status(STATUS.UNAUTHORIZED).json(message);
        }
    }
    catch (e) {
        console.log(e.message);
        logger.logError(req, res, STATUS.INTERNAL_SERVER_ERROR);
        res.status(STATUS.INTERNAL_SERVER_ERROR).end();
    }

}

/* Get all products. */
export async function getAllProducts(req, res) {
    try {
        const products = await productService.getAll();
        res.status(STATUS.OK).json(products);
    }
    catch (e) {
        console.log(e);
        logger.logError(req, res, STATUS.INTERNAL_SERVER_ERROR);
        res.status(STATUS.INTERNAL_SERVER_ERROR).end();
    }
}

/* Get product based on ID. */
export async function getProductById(req, res) {
    try {
        let id = req.params.idProduct;
        const productRequested = await productService.getById(id);

        if (productRequested) {
            res.status(STATUS.OK).json(productRequested);
        }
        else {
            logger.logWarn(req, res, STATUS.NOT_FOUND);
            res.status(STATUS.NOT_FOUND).json('Product not found.');
        }
    }
    catch (e) {
        console.log(e.message);
        logger.logError(req, res, STATUS.INTERNAL_SERVER_ERROR);
        res.status(STATUS.INTERNAL_SERVER_ERROR).end();
    }
}

/* Get products based on category. */
export async function getProductsByCategory(req, res) {
    try {
        let idCategory = parseInt(req.params.idCategory);
        const productsRequested = await productService.getByCategory(idCategory);

        if (productsRequested.length > 0) {
            res.status(STATUS.OK).json(productsRequested);
        }
        else {
            logger.logWarn(req, res, STATUS.NOT_FOUND);
            res.status(STATUS.NOT_FOUND).json('Category not found.');
        }
    }
    catch (e) {
        console.log(e.message);
        logger.logError(req, res, STATUS.INTERNAL_SERVER_ERROR);
        res.status(STATUS.INTERNAL_SERVER_ERROR).end();
    }
}

// Update product based on ID
export async function updateProduct(req, res) {
    try {
        if (req.user.admin) {
            // Search element and get original data first
            let id = req.params.id;
            const productRequested = await productService.getById(id);
            if (productRequested) {
                let newPrice = parseFloat(parseFloat(req.body.price).toFixed(2));
                let newStock = parseInt(req.body.stock);
                // In case there isn't new data, conserve original data
                const data = {
                    timestamp: Date.now(),
                    name: req.body.name || productRequested.name,
                    description: req.body.description || productRequested.description,
                    cathegory: {
                        id: parseInt(req.body.cathegory.id),
                        name: req.body.cathegory.name
                    } || productRequested.cathegory,
                    image: req.body.image || productRequested.image,
                    price: newPrice || productRequested.price,
                    stock: newStock || productRequested.stock
                };

                await productService.update(id, data);
                res.status(STATUS.ACCEPTED).end();
            }
            else {
                logger.logWarn(req, res, STATUS.NOT_FOUND);
                res.status(STATUS.NOT_FOUND).json('Product not found.');
            }
        }
        else {
            let message = {
                error: -1,
                route: 'localhost:8080/api/productos/:id',
                method: 'PUT',
                status: 'Unathorized'
            }
            logger.logWarn(req, res, STATUS.UNAUTHORIZED);
            res.status(STATUS.UNAUTHORIZED).json(message);
        }
    }
    catch (e) {
        console.log(e.message);
        logger.logError(req, res, STATUS.INTERNAL_SERVER_ERROR);
        res.status(STATUS.INTERNAL_SERVER_ERROR).end();
    }
}

// Delete product based on ID
export async function deleteProduct(req, res) {
    try {
        if (req.user.admin) {
            let id = req.params.id;
            let succeed = await productService.deleteOne(id);

            if (succeed > 0) { res.status(STATUS.ACCEPTED).end(); }
            else {
                logger.logWarn(req, res, STATUS.NOT_FOUND);
                res.status(STATUS.NOT_FOUND).json('Product not found.');
            }
        }
        else {
            let message = {
                error: -1,
                route: 'localhost:8080/api/productos/:id',
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