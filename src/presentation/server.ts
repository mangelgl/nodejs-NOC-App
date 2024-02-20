import 'dotenv/config';
import { LogRepositoryImpl } from '../infrastructure/repositories/log.repository.impl';
import { FileSystemDataSource } from '../infrastructure/datasource/file-system.datasource';
import { SendEmailLogs } from '../domain/use-cases/email/send-email-logs';
import { EmailService } from './email/email.service';
import { CronService } from './cron/cron-service';
import { CheckService } from '../domain/use-cases/checks/check-service';
import { MongoLogDataSource } from '../infrastructure/datasource/mongo-log.datasource';
import { LogSeverityLevel } from '../domain/entities/log.entity';
import { PostgresLogDataSource } from '../infrastructure/datasource/postgres-log.datadource';
import { CheckServiceMultiple } from '../domain/use-cases/checks/check-service-multiple';

const fsLogRepository = new LogRepositoryImpl(
    new FileSystemDataSource()
);

const mongoLogRepository = new LogRepositoryImpl(
    new MongoLogDataSource()
);

const postgresLogRepository = new LogRepositoryImpl(
    new PostgresLogDataSource()
);

const emailService = new EmailService( fsLogRepository );

export class Server {


    static async run () {

        console.log('Server running...');

        // const logs = await logRepository.getLogs( LogSeverityLevel.medium );
        // console.log(logs);

        const url = 'https://www.google.com';
        CronService.createJob(
            '0/3 * * * * *',
            () => {

                // new CheckService( 
                //     mongoLogRepository,
                //     () => console.log(`Service ${url} is OK`),
                //     ( error ) => console.log(error)
                // )
                new CheckServiceMultiple(
                    [ fsLogRepository, mongoLogRepository, postgresLogRepository ],
                    () => console.log(`Service ${url} is OK`),
                    ( error ) => console.log(error)
                )
                .execute( url );
            }
        )
    }
}