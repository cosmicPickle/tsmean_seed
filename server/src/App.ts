import * as express from 'express'
import AppRoutesRegistry from './core/routing/AppRoutesRegistry';
import { globalMiddlewares } from './configuration/middlewares/middlewaresConfig';
import { appNotFoundError } from './configuration/errors/errorsConfig';

export class App {
    public express = express();
    constructor () {}

    init() {
        this.mountGlobalMiddlewares();
        this.mountRoutes();

        //Add a 404
        this.express.use('*', (req, res) => {
            res.status(404).json(appNotFoundError.get())
        })
        return this;
    } 

    private mountGlobalMiddlewares() {
        const routeMiddlewares = globalMiddlewares._;
        routeMiddlewares && this.express.use(routeMiddlewares);
    }
    private mountRoutes (): void {
        const routesRegistry  = new AppRoutesRegistry(express.Router());
        this.express.use('/', routesRegistry.getRouter());
    }
}


export default new App().init().express