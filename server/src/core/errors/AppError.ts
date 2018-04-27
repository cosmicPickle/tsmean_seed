export class AppError {
    protected message: string
    protected payload: any

    constructor(protected code: number) {}
    
    get() {
        return { 
            code: this.code,
            message: this.message,
            payload: this.payload
        }
    }
} 

export default AppError;