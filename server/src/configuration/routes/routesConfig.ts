import { userRoute } from './../../routes/UserRoute';
import { defaultRoute } from './../../routes/DefaultRoute';
import AppRoute from './../../core/routing/AppRoute';

export const routesConfig: AppRoute[] = [
    defaultRoute,
    userRoute
];

export default routesConfig;