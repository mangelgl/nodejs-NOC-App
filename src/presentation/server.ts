import { CronService } from './cron/cron-service';
import { CheckService } from '../domain/use-cases/checks/check-service';

export class Server {

    static run () {

        console.log('Server running...');

        const url = 'http://localhost:3000/';
        CronService.createJob(
            '*/3 * * * * *',
            () => {
                new CheckService(
                    () => console.log(`${url} is ok`),
                    ( error ) => console.error( error )
                ).execute(url);
            }
        );

    }
}