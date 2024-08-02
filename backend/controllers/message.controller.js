import messageService from '../services/message.service.js';
import { variables } from '../config/config.js';
import logger from '../logs/logger.js';
import MessageDTO from '../models/dto/message.dto.js';

const STATUS = variables.STATUS;

export async function getAll(req, res) {
    try {
        const messages = await messageService.getAll();
        let messagesDTO = [];
        messages.forEach(m => { messagesDTO.push(new MessageDTO(m)) });
        res.status(STATUS.OK).json(messagesDTO);
    } catch (e) {
        console.log(e.message);
        logger.logError(req, res, STATUS.INTERNAL_SERVER_ERROR);
        res.status(STATUS.INTERNAL_SERVER_ERROR).end();
    }
}

export async function getUserMessages(req, res) {
    try {
        const userEmail = req.params.email;
        const userMessages = await messageService.getAllByEmail(userEmail);
        if (!userMessages || userMessages.length === 0) { res.status(STATUS.NOT_FOUND).json({ message: 'There are no messages.' }); }
        else {
            let messagesDTO = [];
            userMessages.forEach(m => { messagesDTO.push(new MessageDTO(m)) });
            res.status(STATUS.OK).json(messagesDTO);
        }
    } catch (e) {
        console.log(e.message);
        logger.logError(req, res, STATUS.INTERNAL_SERVER_ERROR);
        res.status(STATUS.INTERNAL_SERVER_ERROR).end();
    }
}

export async function addMessage(req, res) {
    try {
        const newMessage = {
            email: req.user.email,
            timestamp: Date.now(),
            ...req.body
        }
        await messageService.create(newMessage);
        res.status(STATUS.ACCEPTED).end();
    } catch (e) {
        console.log(e.message);
        logger.logError(req, res, STATUS.INTERNAL_SERVER_ERROR);
        res.status(STATUS.INTERNAL_SERVER_ERROR).end();
    }
}