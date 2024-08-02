import { cartDAO } from "../models/daos/index.js";

async function getAll() {
    try {
        return cartDAO.getAll();
    } catch (e) {
        throw new Error(e);
    }
}

async function getAllFromCart(idCart) {
    try {
        return cartDAO.getAllFromCart(idCart);
    } catch (e) {
        throw new Error(e);
    }
}

async function create(data) {
    try {
        return cartDAO.create(data);
    } catch (e) {
        throw new Error(e);
    }
}

async function addToCart(idCart, data) {
    try {
        return cartDAO.addToCart(idCart, data);
    } catch (e) {
        throw new Error(e);
    }
}

async function getById(id) {
    try {
        return cartDAO.getById(id);
    } catch (e) {
        throw new Error(e);
    }
}

async function update(id, data) {
    try {
        return cartDAO.update(id, data);
    } catch (e) {
        throw new Error(e);
    }
}

async function deleteOne(id) {
    try {
        return cartDAO.deleteOne(id);
    } catch (e) {
        throw new Error(e);
    }
}

async function deleteFromCart(idCart, idProduct) {
    try {
        return cartDAO.deleteOneFromCart(idCart, idProduct);
    } catch (e) {
        throw new Error(e);
    }
}

export default {
    getAll,
    getById,
    getAllFromCart,
    create,
    addToCart,
    update,
    deleteOne,
    deleteFromCart
}