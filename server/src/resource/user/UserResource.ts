import { Response } from "express";
import { MongoError, DeleteWriteOpResultObject } from "mongodb";

import { AppResource } from "./../../core/routing/AppResource";
import { validator, middlewares } from "./middlewares";
import { User, userMongoModel } from './models/mongo/';

export class UserResource extends AppResource {
    protected defaultPath = '/user/:username?';
    protected validator = validator; 
    protected middlewares = middlewares;
    protected model = userMongoModel;
}

export let userResource = new UserResource();