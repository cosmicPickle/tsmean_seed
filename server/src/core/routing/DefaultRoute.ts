import AppRoute from './AppRoute';
import { AppBaseRequest } from '../models/routing/request/AppBaseRequest';

export class DefaultRoute extends AppRoute<AppBaseRequest<any, any>> {
    protected path = '/'
}

export let defaultRoute = new DefaultRoute();