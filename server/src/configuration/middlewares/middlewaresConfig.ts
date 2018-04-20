import * as bodyParser from 'body-parser';
import { AppMiddlewares } from './../../core/middlewares/AppMiddleware';
import { appLoggerMiddleware } from './../../core/middlewares/AppLoggerMiddleware';
import { appAuthenticateMiddleware } from './../../core/middlewares/AppAuthenticateMiddleware';

export const middlewares: AppMiddlewares= {
    _: [
        bodyParser.urlencoded({ extended: true }),
        bodyParser.json({ strict: false})
    ],
    '/user/:name?': {
        get: [
            appLoggerMiddleware.log, 
            //appAuthenticateMiddleware.check
        ]
    }
};

export default middlewares;
