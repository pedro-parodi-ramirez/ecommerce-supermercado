import { orderDAO } from "../models/daos/index.js";

async function getAll() {
    try {
        return orderDAO.getAll();
    } catch (e) {
        throw new Error(e);
    }
}

async function getById(id) {
    try {
        return orderDAO.getById(id);
    } catch (e) {
        throw new Error(e);
    }
}

async function store(data) {
    try {
        return orderDAO.create(data);
    } catch (e) {
        throw new Error(e);
    }
}

async function deleteOne(id) {
    try {
        return orderDAO.deleteOne(id);
    } catch (e) {
        throw new Error(e);
    }
}

export default {
    getAll,
    getById,
    store,
    deleteOne
}