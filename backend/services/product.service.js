import { productDAO } from "../models/daos/index.js";

async function getAll() {
    try {
        return productDAO.getAll();
    } catch (e) {
        throw new Error(e);
    }
}

async function getById(id) {
    try {
        return productDAO.getById(id);
    } catch (e) {
        throw new Error(e);
    }
}

async function getByCategory(id) {
    try {
        return productDAO.getByCategory(id);
    } catch (e) {
        throw new Error(e);
    }
}

async function create(data) {
    try {
        return productDAO.create(data);
    } catch (e) {
        throw new Error(e);
    }
}

async function update(id, data) {
    try {
        return productDAO.update(id, data);
    } catch (e) {
        throw new Error(e);
    }
}

async function deleteOne(id) {
    try {
        return productDAO.deleteOne(id);
    } catch (e) {
        throw new Error(e);
    }
}

export default {
    getAll,
    getById,
    getByCategory,
    create,
    update,
    deleteOne
}