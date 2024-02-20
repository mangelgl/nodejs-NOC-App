import fs from 'fs';
import { LogDataSource } from "../../domain/datasource/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";


export class FileSystemDataSource implements LogDataSource {

    private readonly logPath = 'logs/';
    private readonly lowLogsPath = 'logs/low.log';
    private readonly mediumLogsPath = 'logs/medium.log';
    private readonly highLogsPath = 'logs/high.log';

    constructor() {
        this.createLogsFiles();
    }

    private createLogsFiles = () => {
        if ( !fs.existsSync( this.logPath ) ) {
            fs.mkdirSync(this.logPath);
        }

        [
            this.lowLogsPath,
            this.mediumLogsPath,
            this.highLogsPath
        ].forEach( path => {
            if ( !fs.existsSync( path ) ) {                
                fs.writeFileSync( path, '' );
            }
        });
        
    }

    async saveLog ( newLog : LogEntity ): Promise<void> {

        const logAsJSON = `${JSON.stringify(newLog)}\n`;
        
        fs.appendFileSync( this.lowLogsPath, logAsJSON );

        if ( newLog.level === LogSeverityLevel.low ) return;
        if ( newLog.level === LogSeverityLevel.medium ) {
            fs.appendFileSync( this.mediumLogsPath, logAsJSON );
        } else {
            fs.appendFileSync( this.highLogsPath, logAsJSON );
        }
        console.log('File log appended');
    }

    private getLogsFromFile = ( path: string ): LogEntity[] => {
        const content = fs.readFileSync( path, 'utf-8' );
        if ( content === '' ) return [];
        const logs = content.split('\n').map(
            ( log: string ) => LogEntity.fromJson( log )
        );

        return logs;
    }

    async getLogs ( severity : LogSeverityLevel ): Promise<LogEntity[]> {
        
        switch ( severity ) {
            case LogSeverityLevel.low:
                return this.getLogsFromFile( this.lowLogsPath );                

            case LogSeverityLevel.medium:
                return this.getLogsFromFile( this.mediumLogsPath );

            case LogSeverityLevel.high:
                return this.getLogsFromFile( this.highLogsPath );
        
            default:
                throw new Error(`${severity} is not a valid severity`);
        };        
    }
}