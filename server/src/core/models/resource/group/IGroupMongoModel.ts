import { AppServicePath } from './../../AppServicePath';

export interface IGroup extends Document {
    name: string;
    allowedRoutes: string[],
    allowedServices: AppServicePath[]
}