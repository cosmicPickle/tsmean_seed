import { Request, Response, NextFunction} from "express";


export type AppMiddlewareFunction =  (req: Request, res: Response, next?: NextFunction) => void;
export type AppMiddleware = {
    _?: AppMiddlewareFunction[]
    get? : AppMiddlewareFunction[]
    post? : AppMiddlewareFunction[]
    put? : AppMiddlewareFunction[]
    delete? : AppMiddlewareFunction[]
    [key: string] : AppMiddlewareFunction[]
}