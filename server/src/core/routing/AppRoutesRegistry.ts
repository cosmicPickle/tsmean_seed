import AppResource from './AppResource';
import resourceConfig from './../../configuration/routes/resourceConfig';

export class AppRoutesRegistry {

    private resources: AppResource[] = resourceConfig;

    constructor(public router: any) {
        this.resources.forEach((resource) => {
            resource.init();
            resource.mountRoutes(this.router);
        })
    }

    getRouter() {
        return this.router;
    }
}

export default AppRoutesRegistry;