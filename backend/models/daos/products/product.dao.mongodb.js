import MongoDBClass from '../repositories/MongoDBClass.js';
import productModel from '../../schema/product.model.js';

let productInstance = null;

class ProductDaoMongoDB extends MongoDBClass {
    constructor() { super(productModel); }

    /* Search element based on ID */
    async getByCategory(idCategory) {
        try {
            const categories = await this.collection.find({ "cathegory.id": idCategory });
            return categories;
        }
        catch (e) {
            throw new Error('❌ Error searching by ID in DB ❌\n' + e);
        }
    }

    // Simpleton schema for class
    static getInstance() {
        if (!productInstance) {
            productInstance = new ProductDaoMongoDB(productModel);
        }
        return productInstance;
    }
}

export default ProductDaoMongoDB;