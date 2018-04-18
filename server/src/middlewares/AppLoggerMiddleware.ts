import { AppMiddlewareFunction } from "../core/middlewares/AppMiddleware";
import { logger } from "../core/lib/AppLogger";

export class AppLoggerMiddleware {
    log: AppMiddlewareFunction  = (req, res, next)  => {
        logger.debug(`Request ${req.method.toUpperCase()} ${req.path}: ${JSON.stringify(req.params)}`);
        next();
    }
}

export let appLoggerMiddleware = new AppLoggerMiddleware()