import { logger } from "../lib/AppLogger";

export interface IAppError {
    code: number,
    message: string,
    payload: any,
    debug: string
}
export class AppError {
    protected message: string
    protected payload: any
    protected _debug: Error
    constructor(protected code: number) {}
    
    debug<T extends Error>(payload: T) {
        logger.error(payload);
        this._debug = payload;
        return this;
    }
    get() {
        return { 
            code: this.code,
            message: this.message,
            payload: this.payload,
            debug: (process.env.NODE_ENV == 'development' && this._debug) ? this._debug.toString() : null
        }
    }    
} 

export default AppError;