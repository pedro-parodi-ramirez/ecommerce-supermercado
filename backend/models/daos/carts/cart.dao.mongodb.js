import MongoDBClass from '../repositories/MongoDBClass.js';
import cartModel from '../../schema/cart.model.js';

let cartInstance = null;

class CartDaoMongoDB extends MongoDBClass {
    constructor() { super(cartModel) }

    /* Get all products from cart */
    async getAllFromCart(idCart) {
        try {
            const query = await this.collection.findById({ _id: idCart }, { products: 1, _id: 0 });
            if (query) { return query.products; }
            else { return false; }
        }
        catch (e) {
            throw new Error('❌ Error getting products from cart ❌\n' + e);
        }
    }

    /* Add product to cart */
    async addToCart(idCart, product) {
        try {
            // If product exists, increase quantity. Otherwise add product to cart
            let response = await this.collection.updateOne({ _id: idCart, "products.product._id": product._id }, { $inc: { "products.$.quantity": 1 } });

            if (response.modifiedCount === 0) {
                response = await this.collection.updateOne({ _id: idCart }, {
                    $push: { "products": { product, quantity: 1 } }
                });
            }
            return response.matchedCount && response.modifiedCount;
        }
        catch (e) {
            throw new Error('❌ Error adding product to cart ❌\n' + e);
        }
    }

    /* Delete product from cart */
    async deleteOneFromCart(idCart, idProduct) {
        try {
            let response = await this.collection.updateOne({ _id: idCart }, { $pull: { "products": { "product._id": idProduct } } });
            return response.matchedCount && response.modifiedCount;
        }
        catch (e) {
            throw new Error('❌ Error deleting product from cart ❌\n' + e);
        }
    }

    // Simpleton schema for class
    static getInstance() {
        if (!cartInstance) {
            cartInstance = new CartDaoMongoDB();
        }
        return cartInstance;
    }
}

export default CartDaoMongoDB;