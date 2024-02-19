import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log.repository";

interface CheckServiceUseCase {
    execute( url: string ): Promise<boolean>;
}

type SuccessCallback = (() => void) | undefined;
type ErrorCallback = (( error: string ) => void) | undefined;

export class CheckService implements CheckServiceUseCase {

    constructor(
        /**
         * Inyección de dependencias
         */
        private readonly logRepository: LogRepository,
        private readonly successCallback: SuccessCallback,
        private readonly errorCallback: ErrorCallback
    ){}

    public async execute( url: string ): Promise<boolean> {

        try {
            const request = await fetch( url );
            if (!request.ok) throw new Error(`Error on check service ${url}`);

            const log = new LogEntity({
                message: `Service ${url} is OK`, 
                level: LogSeverityLevel.low,
                origin: 'check-service'
            });
            this.logRepository.saveLog( log );
            
            this.successCallback && this.successCallback();
            return true;
        } catch (error) {

            const errorMessage = `${url} is not OK. ${error}`;
            const log = new LogEntity({
                message: errorMessage, 
                level: LogSeverityLevel.high,
                origin: 'check-service'
            });
            this.logRepository.saveLog( log );

            this.errorCallback && this.errorCallback(`${error}`);
            return false;
        }

    }
}