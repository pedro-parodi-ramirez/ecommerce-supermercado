import { messageDAO } from "../models/daos/index.js";

async function getAll() {
    try {
        return messageDAO.getAll();
    } catch (e) {
        throw new Error(e);
    }
}

async function getAllByEmail(email) {
    try {
        return messageDAO.getAllByEmail(email);
    } catch (e) {
        throw new Error(e);
    }
}

async function create(data) {
    try {
        return messageDAO.create(data);
    } catch (e) {
        throw new Error(e);
    }
}

export default {
    getAll,
    getAllByEmail,
    create
}