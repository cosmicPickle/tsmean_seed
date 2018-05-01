import { Request } from 'express';

export interface AppBaseQuery {
    sort: string;
    order: -1|1;
    page: number;
}

export interface AppBaseBody {
    uuid: string;
}

export interface AppBaseRequest<T extends AppBaseQuery, Q extends AppBaseBody> extends Request {
    query: T;
    body: Q;
}