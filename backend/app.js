import express from 'express';
import expressSession from 'express-session';
import expressFileUpload from 'express-fileupload';
import path from 'path';
import { variables, config } from './config/config.js';
import index from './routes/index.js';
import logger from './logs/logger.js';
import passport from './utils/passport.js';

const app = express();
const rootPath = variables.PATH;
const STATUS = variables.STATUS;
const SESSION_TIMEOUT = parseInt(config.SESSION_TIMEOUT);

configApp();

// Config app
function configApp() {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(expressFileUpload());
  app.use(expressSession({
    secret: '3biXMV8#m5s7',
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: SESSION_TIMEOUT,
    },
    rolling: true,
    resave: false,
    saveUninitialized: false,
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/', (req, _, next) => logger.logInfo(req, _, next), index);
  app.use(express.static(path.join(rootPath, '../frontend/public')));

  app.use(function (req, res) {
    let message = {
      error: -2,
      status: 'Route not implemented'
    }
    res.status(STATUS.NOT_FOUND).json(message);
    logger.logWarn(req, res, STATUS.NOT_FOUND)
  });
}

export default app;