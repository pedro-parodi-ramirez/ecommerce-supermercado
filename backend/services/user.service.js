import { userDAO } from "../models/daos/index.js";

async function getAll() {
    try {
        return userDAO.getAll();
    } catch (e) {
        throw new Error(e);
    }
}

async function create(data) {
    try {
        const response = userDAO.create(data)
        return response;
    } catch (e) {
        throw new Error(e);
    }
}

async function getByEmail(email) {
    try {
        return userDAO.getByEmail(email);
    } catch (e) {
        throw new Error(e);
    }
}

async function getById(id) {
    try {
        return userDAO.getById(id);
    } catch (e) {
        throw new Error(e);
    }
}

async function update(id, data) {
    try {
        return userDAO.update(id, data);
    } catch (e) {
        throw new Error(e);
    }
}

async function deleteOne(id) {
    try {
        return userDAO.deleteOne(id);
    } catch (e) {
        throw new Error(e);
    }
}

export default {
    getAll,
    getById,
    getByEmail,
    create,
    update,
    deleteOne
}