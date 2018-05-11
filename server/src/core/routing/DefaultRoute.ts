import AppRoute from './AppRoute';

export class DefaultRoute extends AppRoute {
    protected path = '/'
}

export let defaultRoute = new DefaultRoute();