import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(path.dirname(__filename) + '/..');
const STATUS = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};
const variables = {
    STATUS: STATUS,
    PATH: __dirname
}
const config = {
    ADMIN: {
        EMAIL: process.env.ADMIN_EMAIL
    },
    NODEMAILER: {
        EMAIL: 'manager.coderhouse@gmail.com',
        PASS: process.env.NODEMAILER_PASS
    },
    MONGODB: {
        URI: process.env.MONGODB_URI,
        dbName: 'ecommerce'
    },
    PERSISTANCE: process.env.PERSISTANCE,
    SESSION_TIMEOUT: process.env.SESSION_TIMEOUT,
    CUSTOMER_SERVICE_EMAIL: 'admin@gmail.com'
}

export { variables, config }