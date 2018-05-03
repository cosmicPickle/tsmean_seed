import { Request } from 'express';

export interface AppBaseQuery {
    token?: string;
    sort: string;
    order: -1|1;
    page: number;
}

export interface AppBaseBody {
    token?: string;
    uuid: string;
}

export interface AppBaseRequest<T extends AppBaseQuery, Q extends AppBaseBody> extends Request {
    query: T;
    body: Q;
}