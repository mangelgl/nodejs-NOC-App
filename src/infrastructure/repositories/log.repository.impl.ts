import { LogDataSource } from "../../domain/datasource/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import { LogRepository } from "../../domain/repository/log.repository";

export class LogRepositoryImpl implements LogRepository {

    constructor(
        private readonly logDataSource: LogDataSource,
    ) {
        
    }

    async saveLog(log: LogEntity): Promise<void> {
        return this.logDataSource.saveLog( log );
    }

    async getLogs(severity: LogSeverityLevel): Promise<LogEntity[]> {
        return this.logDataSource.getLogs( severity );
    }

}