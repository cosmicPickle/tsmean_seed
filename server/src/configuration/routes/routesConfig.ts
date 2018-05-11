import { userRoute } from './../../core/routing/UserRoute';
import { groupRoute } from './../../core/routing/GroupRoute';
import { defaultRoute } from './../../core/routing/DefaultRoute';
import AppRoute from './../../core/routing/AppRoute';

export const routesConfig: AppRoute[] = [
    defaultRoute,
    userRoute,
    groupRoute
];

export default routesConfig;