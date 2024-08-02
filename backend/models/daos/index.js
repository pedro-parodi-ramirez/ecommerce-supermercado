import { config } from '../../config/config.js';
import { initMongoDB } from './repositories/MongoDBClass.js';

let productDAO, userDAO, cartDAO, orderDAO, messageDAO;
switch (config.PERSISTANCE) {
    case 'memory':
        console.log("📂 Data persistance: <Memory> 📂");
        const { default: ProductDaoMemory } = await import('./products/product.dao.memory.js');
        const { default: UserDaoMemory } = await import('./users/user.dao.memory.js');
        const { default: CartDaoMemory } = await import('./carts/cart.dao.memory.js');
        const { default: OrderDaoMemory } = await import('./orders/order.dao.memory.js');
        const { default: MessageDaoMemory } = await import('./messages/message.dao.memory.js');
        productDAO = ProductDaoMemory.getInstance();
        userDAO = UserDaoMemory.getInstance();
        cartDAO = CartDaoMemory.getInstance();
        orderDAO = OrderDaoMemory.getInstance();
        messageDAO = MessageDaoMemory.getInstance();

        // Init 10 products, 2 users (one admin, one random) and a welcome message in message center
        productDAO.initProducts();
        userDAO.initUsers();
        break;
    case 'mongodb':
        console.log("📂 Data persistance: <MongoDB> 📂");
        initMongoDB();
        const { default: ProductDaoMongoDB } = await import('./products/product.dao.mongodb.js');
        const { default: UserDaoMongoDB } = await import('./users/user.dao.mongodb.js');
        const { default: CartDaoMongoDB } = await import('./carts/cart.dao.mongodb.js');
        const { default: OrderDaoMongoDB } = await import('./orders/order.dao.mongodb.js');
        const { default: MessageDaoMongoDB } = await import('./messages/message.dao.mongodb.js');
        productDAO = ProductDaoMongoDB.getInstance();
        userDAO = UserDaoMongoDB.getInstance();
        cartDAO = CartDaoMongoDB.getInstance();
        orderDAO = OrderDaoMongoDB.getInstance();
        messageDAO = MessageDaoMongoDB.getInstance();
        break;
    default:
        console.log("📂 Data persistance: <default:MongoDB> 📂");
        initMongoDB();
        const { default: ProductDaoMongoDB_ } = await import('./products/product.dao.mongodb.js');
        const { default: UserDaoMongoDB_ } = await import('./users/user.dao.mongodb.js');
        const { default: CartDaoMongoDB_ } = await import('./carts/cart.dao.mongodb.js');
        const { default: OrderDaoMongoDB_ } = await import('./orders/order.dao.mongodb.js');
        const { default: MessageDaoMongoDB_ } = await import('./messages/message.dao.mongodb.js');
        productDAO = ProductDaoMongoDB_.getInstance();
        userDAO = UserDaoMongoDB_.getInstance();
        cartDAO = CartDaoMongoDB_.getInstance();
        orderDAO = OrderDaoMongoDB_.getInstance();
        messageDAO = MessageDaoMongoDB_.getInstance();
        break;
}

export { productDAO, userDAO, cartDAO, orderDAO, messageDAO };