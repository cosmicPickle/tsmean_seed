import { AppServicePath } from '../../AppServicePath';
export interface IUserMongoModel {
    username: string;
    password: string;
    age: number;
    country: string;
    group: string;
    allowedServices: AppServicePath[];
    allowedRoutes: string[];
}