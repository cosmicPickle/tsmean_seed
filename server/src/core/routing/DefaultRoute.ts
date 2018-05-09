import AppRoute from './AppRoute';
import { io } from '../models/resource/base/types';

export class DefaultRoute extends AppRoute<io.AppBaseRequest> {
    protected path = '/'
}

export let defaultRoute = new DefaultRoute();