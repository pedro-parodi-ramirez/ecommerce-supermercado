import MemoryClass from "../repositories/MemoryClass.js";

let orderInstance = null;

export default class OrderDaoMemory extends MemoryClass {
    // Simpleton schema for class
    static getInstance() {
        if (!orderInstance) {
            orderInstance = new OrderDaoMemory();
        }
        return orderInstance;
    }
}