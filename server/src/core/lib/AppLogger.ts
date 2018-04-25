
import * as winston from 'winston';

export class AppLogger {
    private __winston;
    private __transportsDev: winston.TransportInstance[] = [
        new winston.transports.Console({
            level: 'debug',
            colorize: true,
            handleExceptions: true,
            humanReadableUnhandledException: true
        }),
        new winston.transports.File({
            filename: './logs/app.log',
            maxsize: 1024*1024,
            level: 'error'
        })
    ];
    private __transportsProd: winston.TransportInstance[] = [
        new winston.transports.File({
            filename: './logs/app.log',
            maxsize: 1024*1024,
            level: 'info',
            handleExceptions: true,
            humanReadableUnhandledException: true
        })
    ];

    private __loggerOptions: winston.LoggerOptions = {
        exitOnError: false
    }

    constructor() {
        
        if(process.env.NODE_ENV === 'development')
            this.__loggerOptions.transports = this.__transportsDev;
        else 
            this.__loggerOptions.transports = this.__transportsProd;

        this.__winston = new winston.Logger(this.__loggerOptions);
    }
    /**
     * logger
     */
    public logger() {
        return this.__winston;
    }
}

export let logger = new AppLogger().logger();