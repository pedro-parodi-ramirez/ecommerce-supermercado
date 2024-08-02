import MemoryClass from '../repositories/MemoryClass.js';

let cartInstance = null;

class CartDaoMemory extends MemoryClass {
    /* Get all products from cart */
    async getAllFromCart(idCart) {
        try {
            const cart = this.getById(idCart);
            if (cart) { return cart.products; }
            else { return false }
        }
        catch (e) {
            throw new Error('❌ Error getting products from cart ❌\n' + e);
        }
    }

    /* Add product to cart */
    async addToCart(idCart, product) {
        try {
            let succeed = false;

            // Searc cart
            let cart = this.getById(idCart);

            if (cart) {
                // Search if product exists in cart
                let inChartIndex = cart.products.findIndex(p => p.product._id === product._id);

                // Increase quantity or add it to cart
                if (inChartIndex === -1) { cart.products.push({ product: product, quantity: 1 }) }
                else { cart.products[inChartIndex].quantity++ }
                succeed = true;
            }
            else {
                succeed = false;
            }
            return succeed;
        }
        catch (e) {
            throw new Error('❌ Error adding product to cart ❌\n' + e);
        }
    }

    /* Delete product from cart */
    async deleteOneFromCart(idCart, idProduct) {
        try {
            let succeed = false;

            // Search cart
            let cart = this.array.find(c => c._id === idCart);

            if (cart) {
                // Search product in cart
                succeed = cart.products.some(p => p.product._id === idProduct);

                if (succeed) { cart.products = cart.products.filter(p => p.product._id !== idProduct); }
            }
            return succeed;
        }
        catch (e) {
            throw new Error('❌ Error deleting product from cart ❌\n' + e);
        }
    }

    // Simpleton schema for class
    static getInstance() {
        if (!cartInstance) {
            cartInstance = new CartDaoMemory();
        }
        return cartInstance;
    }
}

export default CartDaoMemory;