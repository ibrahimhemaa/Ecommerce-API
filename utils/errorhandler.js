export class AppError extends Error
{
    constructor(statuscode , message)
    {
        super(message)
        this.statuscode = statuscode
        this.status = `${this.statuscode}`.startsWith(4) ? 'Fail' : 'Error';        
        this.isOperational = true
    }
}