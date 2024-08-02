import winston from 'winston';

const logger = winston.createLogger({
    level: 'error',
    transports: [
        new winston.transports.Console({ level: 'info' }),
        new winston.transports.File({ filename: './backend/logs/warning.log', level: 'warn' }),
        new winston.transports.File({ filename: './backend/logs/error.log', level: 'error' })
    ]
})

function logInfo(req, _, next) {
    let info = 'METHOD: ' + req.method + ' | URL: ' + req.protocol + '://' + req.get('host') + req.originalUrl;
    logger.info(info);
    next();
}

function logWarn(req, _, status) {
    let warn = 'METHOD: ' + req.method + ' | URL: ' + req.protocol + '://' + req.get('host') + req.originalUrl + ' | STATUS: ' + status;
    logger.warn(warn);
}

function logError(req, _, status) {
    let error = 'METHOD: ' + req.method + ' | URL: ' + req.protocol + '://' + req.get('host') + req.originalUrl + ' | STATUS: ' + status;
    logger.error(error);
}

export default {
    logInfo,
    logWarn,
    logError
};