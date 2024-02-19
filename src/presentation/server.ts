import { CronService } from './cron/cron-service';
import { CheckService } from '../domain/use-cases/checks/check-service';
import { FileSystemDataSource } from '../infrastructure/datasource/file-system.datasource';
import { LogRepositoryImpl } from '../infrastructure/repositories/log.repository.impl';

const fileSystemLogRepository = new LogRepositoryImpl(
    new FileSystemDataSource()
);

export class Server {

    static run () {

        console.log('Server running...');

        // const url = 'http://google.es/';
        const url = 'http://localhost:3000/';
        CronService.createJob(
            '*/3 * * * * *',
            () => {
                new CheckService(
                    fileSystemLogRepository,                
                    undefined,
                    undefined
                ).execute(url);
            }
        );
    }
}