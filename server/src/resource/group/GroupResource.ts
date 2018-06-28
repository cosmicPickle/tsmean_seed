import AppResource from './../../core/routing/AppResource';
import { groupMongoModel } from './models/mongo';
import { validator, middlewares } from './middlewares';


export class GroupResource extends AppResource {
    protected defaultPath = '/group/:name?'
    protected model = groupMongoModel;

    protected validator = validator;
    protected middlewares = middlewares;
}

export let groupResource = new GroupResource();