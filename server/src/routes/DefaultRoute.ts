import AppRoute from './../core/routing/AppRoute';

export class DefaultRoute extends AppRoute {
    protected path = '/'
    
}

export let defaultRoute = new DefaultRoute();