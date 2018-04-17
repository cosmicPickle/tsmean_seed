export class AppError {
    protected code: number
    protected message: string
    protected payload: object
    
    get() {
        return { 
            code: this.code,
            message: this.message,
            payload: this.payload
        }
    }
} 

export default AppError;