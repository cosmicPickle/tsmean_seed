import * as bodyParser from 'body-parser';
import { AppMiddleware } from './../../core/middlewares/AppMiddleware';
import { appLoggerMiddleware } from './../../core/middlewares/AppLoggerMiddleware';
import { appAuthenticateMiddleware } from './../../core/middlewares/AppAuthenticateMiddleware';

export const globalMiddlewares: AppMiddleware= {
    _: [
        bodyParser.urlencoded({ extended: true }),
        bodyParser.json({ strict: false}),
        appLoggerMiddleware.log
    ]
};

export default globalMiddlewares;
