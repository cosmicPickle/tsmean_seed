export interface AppTokenPayload {
    sub: string;
    aud: string;
    iss: string;
    scopes: string[];
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
