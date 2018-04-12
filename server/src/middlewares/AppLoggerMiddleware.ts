import { AppMiddlewareFunction } from "../core/middlewares/AppMiddleware";

export class AppLoggerMiddleware {
    log: AppMiddlewareFunction  = (req, res, next)  => {
        console.log(`Request ${req.method.toUpperCase()} ${req.path}: ${JSON.stringify(req.params)}`);
        next();
    }
}

export let appLoggerMiddleware = new AppLoggerMiddleware()