
export enum LogSeverityLevel {
    low = 'low',
    medium = 'medium',
    high = 'high'
}

export interface LogEntityOptions {
    level : LogSeverityLevel;
    message : string;
    createdAt? : Date;
    origin: string;
}

export class LogEntity {

    public level : LogSeverityLevel;
    public message : string;
    public createdAt : Date;
    public origin: string;

    constructor( options : LogEntityOptions ) {
        this.level = options.level;
        this.message = options.message;
        this.createdAt = options.createdAt ? options.createdAt : new Date();
        this.origin = options.origin;
    }

    static fromJson  = ( json : string = '{}' ) : LogEntity => {
        json = (json === '') ? '{}' : json;
        const { level, message, createdAt, origin } = JSON.parse(json);

        /**
         * ! Validaciones
         */

        const log = new LogEntity( { message, level, createdAt, origin } );

        return log;
    }

    static fromObject = ( object : { [key: string]: any } ): LogEntity => {
        
        const { level, message, origin, createdAt } = object;
        const log = new LogEntity( { level, message, origin, createdAt } );
        return log;
    }
}