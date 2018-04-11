import * as express from 'express'
import AppRoutesRegistry from './core/routing/AppRoutesRegistry';
import middlewaresConfig from './configuration/middlewares/middlewaresConfig';

export class App {
    public express = express();
    private 
    constructor () {}

    init() {
        this.mountGlobalMiddlewares();
        this.mountRoutes();

        return this;
    } 

    private mountGlobalMiddlewares() {
        const routeMiddlewares = middlewaresConfig._;
        routeMiddlewares && this.express.use(routeMiddlewares);
    }
    private mountRoutes (): void {
        const routesRegistry  = new AppRoutesRegistry(express.Router());
        this.express.use('/', routesRegistry.getRouter());
    }
}


export default new App().init().express