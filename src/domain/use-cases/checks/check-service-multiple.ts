import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log.repository";

interface CheckServiceMultipleUseCase {
    execute( url: string ): Promise<boolean>;
}

type SuccessCallback = (() => void) | undefined;
type ErrorCallback = (( error: string ) => void) | undefined;

export class CheckServiceMultiple implements CheckServiceMultipleUseCase {

    constructor(
        /**
         * Inyección de dependencias
         */
        private readonly logRepository: LogRepository[],
        private readonly successCallback: SuccessCallback,
        private readonly errorCallback: ErrorCallback
    ){}

    private callLogs ( log: LogEntity ) {
        this.logRepository.forEach ( logRepository => {
            logRepository.saveLog( log );
        });
    }

    public async execute( url: string ): Promise<boolean> {

        try {
            const request = await fetch( url );
            if (!request.ok) throw new Error(`Error on check service ${url}`);

            const log = new LogEntity({
                message: `Service ${url} is OK`, 
                level: LogSeverityLevel.low,
                origin: 'check-service'
            });
            this.callLogs( log );
            
            this.successCallback && this.successCallback();
            return true;
        } catch (error) {

            const errorMessage = `${url} is not OK. ${error}`;
            const log = new LogEntity({
                message: errorMessage, 
                level: LogSeverityLevel.high,
                origin: 'check-service'
            });
            this.callLogs( log );

            this.errorCallback && this.errorCallback(`${error}`);
            return false;
        }

    }
}