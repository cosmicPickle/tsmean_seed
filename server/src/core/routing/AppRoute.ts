import { appInvalidRouteError } from './../../configuration/errors/errorsConfig';
import { Request, Response, Router } from 'express';
import { AppMiddlewareMethod} from './../middlewares/AppMiddleware'
import middlewaresConfig from './../../configuration/middlewares/middlewaresConfig';
import { io } from '../models/resource/base/types';
interface AppRouteInterface<T extends io.AppBaseRequest<any, any>> {
    get: (req: T, res: Response) => void
    post: (req: T, res: Response) => void
    put: (req: T, res: Response) => void
    delete: (req: T, res: Response) => void
    mount: (router: Router) => void
}

export class AppRoute<T extends io.AppBaseRequest = io.AppBaseRequest> implements AppRouteInterface<T> {
    protected path: string;
    protected middlewares: AppMiddlewareMethod;

    constructor() { }

    get(req: T, res: Response) {
        res.json(appInvalidRouteError.get());
    }

    post(req: T, res: Response) {
        res.json(appInvalidRouteError.get());
    }

    put(req: T, res: Response) {
        res.json(appInvalidRouteError.get());
    }

    delete(req: T, res: Response) {
        res.json(appInvalidRouteError.get());
    }

    mountMiddlewares(router: Router) {
        const routeMiddlewares = <AppMiddlewareMethod>middlewaresConfig[this.path];
        if(routeMiddlewares === undefined)
            return;

        routeMiddlewares._ && router.use(this.path, routeMiddlewares._);
        routeMiddlewares.get && router.get(this.path, routeMiddlewares.get);
        routeMiddlewares.post && router.post(this.path, routeMiddlewares.post);
        routeMiddlewares.put && router.put(this.path, routeMiddlewares.put);
        routeMiddlewares.delete && router.delete(this.path, routeMiddlewares.delete);
    }
    mount(router: Router) {
        this.mountMiddlewares(router);
        router.get(this.path, this.get);
        router.post(this.path, this.post);
        router.put(this.path, this.put);
        router.delete(this.path, this.delete);
    }
}

export default AppRoute;