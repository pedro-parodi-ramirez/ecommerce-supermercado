import MongoDBClass from "../repositories/MongoDBClass.js";
import orderModel from "../../schema/order.model.js";

let orderInstance = null;

export default class OrderDaoMongoDB extends MongoDBClass {
    constructor() { super(orderModel) }

    // Simpleton schema for class
    static getInstance() {
        if (!orderInstance) {
            orderInstance = new OrderDaoMongoDB();
        }
        return orderInstance;
    }
}