import { Request, Response, NextFunction} from "express";


export type AppMiddlewareFunction =  (req: Request, res: Response, next: NextFunction) => void;
export type AppMiddlewareMethod = {
    _?: AppMiddlewareFunction[]
    get? : AppMiddlewareFunction[]
    post? : AppMiddlewareFunction[]
    put? : AppMiddlewareFunction[]
    delete? : AppMiddlewareFunction[]
}
export type AppMiddlewares = {
    _? : AppMiddlewareFunction[],
    [path: string] : AppMiddlewareMethod | AppMiddlewareFunction[]
}