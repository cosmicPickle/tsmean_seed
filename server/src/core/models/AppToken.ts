import { AppServicePath } from "./AppServicePath";

export interface AppTokenPayload {
    sub: string;
    aud: string;
    iss: string;
    scopes: {
        services?: AppServicePath[],
        routes?: string[];
    }
    exp?: string | number;
    nbf?: number | string;
    iat?: number | string;
    
}

export interface AppTokenOptions {
    expiresIn: string | number
}

export class AppToken {
    constructor(
        public payload: AppTokenPayload, 
        public options?: AppTokenOptions
    ){}
}
