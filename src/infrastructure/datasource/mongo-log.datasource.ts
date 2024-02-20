import { LogModel } from "../../data/mongo";
import { LogDataSource } from "../../domain/datasource/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";


export class MongoLogDataSource implements LogDataSource {

    async saveLog( log: LogEntity ): Promise<void> {

        const newLog = await LogModel.create( log );
        console.log(`Mongo Log created ${newLog.id}`);
    }
    async getLogs( severity : LogSeverityLevel ): Promise<LogEntity[]> {
        
        const logs = await LogModel.find({ level: severity });        
        return logs.map( log => LogEntity.fromObject( log ) );
    }

    
}