import userService from '../services/user.service.js';
import { variables, config } from '../config/config.js';
import logger from '../logs/logger.js';
import sendMail from '../utils/nodemailer.js';
import { socketClientDisconnect } from '../socket.js';

const STATUS = variables.STATUS;
const CUSTOMER_SERVICE_EMAIL = config.CUSTOMER_SERVICE_EMAIL;

// Check if user is authenticated
export async function authMe(req, res) {
    try {
        const user = await userService.getById(req.user._id);
        res.status(STATUS.ACCEPTED).json({ user, CUSTOMER_SERVICE_EMAIL });
    } catch (e) {
        console.log(e.message);
        logger.logError(req, res, STATUS.INTERNAL_SERVER_ERROR);
        res.status(STATUS.INTERNAL_SERVER_ERROR).end();
    }
}

// Create new user
export async function createUser(req, res) {
    try {
        const data = req.body;
        const user = await userService.create(data);
        res.status(STATUS.CREATED).json(user);
    } catch (e) {
        console.log(e.message);
        logger.logError(req, res, STATUS.INTERNAL_SERVER_ERROR);
        res.status(STATUS.INTERNAL_SERVER_ERROR).end();
    }
}

// Search user based on ID
export async function searchUser(req, res) {
    try {
        const id = req.params.id;
        const user = await userService.getById(id);
        if (!user) {
            logger.logWarn(req, res, STATUS.NOT_FOUND);
            return res.status(STATUS.NOT_FOUND).json('User not found.');
        }
        res.status(STATUS.OK).json(user);
    } catch (e) {
        console.log(e.message);
        logger.logError(req, res, STATUS.INTERNAL_SERVER_ERROR);
        res.status(STATUS.INTERNAL_SERVER_ERROR).end();
    }
}

// Get all user
export async function getAll(req, res) {
    try {
        if (req.user.admin) {
            const users = await userService.getAll();
            res.status(STATUS.OK).json(users);
        }
        else {
            let message = {
                error: -1,
                route: 'localhost:8080/api/productos',
                method: 'POST',
                status: 'Unauthorized'
            }
            logger.logWarn(req, res, STATUS.UNAUTHORIZED);
            res.status(STATUS.UNAUTHORIZED).json(message);
        }
    } catch (e) {
        console.log(e.message);
        logger.logError(req, res, STATUS.INTERNAL_SERVER_ERROR);
        res.status(STATUS.INTERNAL_SERVER_ERROR).end();
    }
}

// Sign in
export async function signIn(req, res) {
    try {
        const { user } = req;
        if (!req.isAuthenticated()) {
            res.status(STATUS.UNAUTHORIZED).json({ message: 'Invalid email or password' });
            return;
        }
        res.status(STATUS.ACCEPTED).json({ user, CUSTOMER_SERVICE_EMAIL });
    }
    catch (e) {
        console.log(e.message);
        logger.logError(req, res, STATUS.INTERNAL_SERVER_ERROR);
        res.status(STATUS.INTERNAL_SERVER_ERROR).end();
    }
}

// Sign up
export async function signUp(req, res) {
    try {
        const { user } = req;
        sendMail('Nuevo registro', JSON.stringify(user, null, 2), config.ADMIN.EMAIL);
        res.status(STATUS.ACCEPTED).json({ user, CUSTOMER_SERVICE_EMAIL });
    } catch (e) {
        console.log(e.message);
        logger.logError(req, res, STATUS.INTERNAL_SERVER_ERROR);
        res.status(STATUS.INTERNAL_SERVER_ERROR).end();
    }
}

// Sign out
export async function signOut(req, res, next) {
    try {
        const { user } = req;
        socketClientDisconnect(user.email);
        req.logout((error) => {
            if (error) {
                return next(error);
            }
            res.status(STATUS.ACCEPTED).json({ message: `Hasta luego ${user.name} ! 👋` });
        })
    } catch (e) {
        console.log(e.message);
        logger.logError(req, res, STATUS.INTERNAL_SERVER_ERROR);
        res.status(STATUS.INTERNAL_SERVER_ERROR).end();
    }
}

export const verifyAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(STATUS.UNAUTHORIZED).json({ message: 'Unauthorized to private zone.' });
    }
}