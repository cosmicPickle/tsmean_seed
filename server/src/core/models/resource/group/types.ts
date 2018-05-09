import { AppServicePath } from './../../AppServicePath';
import { Document } from 'mongoose';

export interface IGroup extends Document {
    name: string;
    allowedRoutes: string[],
    allowedServices: AppServicePath[]
}