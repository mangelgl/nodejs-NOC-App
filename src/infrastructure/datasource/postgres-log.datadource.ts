import { PrismaClient, SeverityLevel } from "@prisma/client";
import { LogDataSource } from "../../domain/datasource/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

const prismaClient = new PrismaClient();

const SeverityEnum = {
    low: SeverityLevel.LOW,
    medium: SeverityLevel.MEDIUM,
    high: SeverityLevel.HIGH
}

export class PostgresLogDataSource implements LogDataSource {

    async saveLog(log: LogEntity): Promise<void> {
        const { message, origin } = log;
        const level = SeverityEnum[log.level];

        const newLog = await prismaClient.logModel.create({
            data : {
                message,
                level,
                origin
           }
        });
        console.log(`PostgreSQL Log created ${newLog.id}`);
    }

    async getLogs(severity: LogSeverityLevel): Promise<LogEntity[]> {
        const level = SeverityEnum[severity];

        const logs = await prismaClient.logModel.findMany({
            where: { level }
        });
        return logs.map( log => LogEntity.fromObject( log ) );
    }
    

}