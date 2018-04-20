import { userRoute } from './../../routes/UserRoute';
import { groupRoute } from './../../routes/GroupRoute';
import { defaultRoute } from './../../core/routing/DefaultRoute';
import AppRoute from './../../core/routing/AppRoute';

export const routesConfig: AppRoute[] = [
    defaultRoute,
    userRoute,
    groupRoute
];

export default routesConfig;