export class AppError {
    protected code: number
    protected message: string
    
    get() {
        return { 
            code: this.code,
            message: this.message
        }
    }
} 

export default AppError;