import 'dotenv/config';
import { LogRepositoryImpl } from '../infrastructure/repositories/log.repository.impl';
import { FileSystemDataSource } from '../infrastructure/datasource/file-system.datasource';
import { SendEmailLogs } from '../domain/use-cases/email/send-email-logs';
import { EmailService } from './email/email.service';

const fileSystemLogRepository = new LogRepositoryImpl(
    new FileSystemDataSource()
);

const emailService = new EmailService( fileSystemLogRepository );

export class Server {


    static run () {

        console.log('Server running...');        

        new SendEmailLogs(
            emailService,
            fileSystemLogRepository
        ).execute( 'magl81299@gmail.com' );
                
    }
}