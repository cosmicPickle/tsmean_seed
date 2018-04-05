import AppRoute from './AppRoute';
import routesConfig from './../../configuration/routes/routesConfig';

export class AppRoutesRegistry {

    private routes: AppRoute[] = routesConfig;

    constructor(public router: any) {
        this.routes.forEach((route) => {
            route.mount(this.router);
        })
    }

    getRouter() {
        return this.router;
    }
}

export default AppRoutesRegistry;