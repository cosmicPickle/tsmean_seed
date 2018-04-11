import * as bodyParser from 'body-parser';
import { AppMiddlewares } from './../../core/middlewares/AppMiddleware';
import { appLoggerMiddleware } from './../../middlewares/AppLoggerMiddleware';

export const middlewares: AppMiddlewares= {
    _: [
        bodyParser.urlencoded({ extended: false }),
        bodyParser.json(),
        appLoggerMiddleware.log
    ],
    '/user/:name?': {
        get: [appLoggerMiddleware.log]
    }
};

export default middlewares;
