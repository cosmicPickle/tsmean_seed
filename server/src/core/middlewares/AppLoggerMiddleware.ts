import { AppMiddlewareFunction } from "../middlewares/AppMiddleware";
import { logger } from "../lib/AppLogger";

export class AppLoggerMiddleware {
    log: AppMiddlewareFunction  = (req, res, next)  => {
        logger.debug(`Request ${req.method.toUpperCase()} ${req.path}: ${JSON.stringify(req.params)}, ${JSON.stringify(req.body)}`);
        next();
    }
}

export let appLoggerMiddleware = new AppLoggerMiddleware()