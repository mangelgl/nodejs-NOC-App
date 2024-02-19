import nodemailer from 'nodemailer';
import { envsVar } from '../../config/plugins/dotenv.plugin';
import { LogRepository } from '../../domain/repository/log.repository';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';

interface MailOptions {
    to: string | string[];
    subject: string;
    htmlBody: string;
    // TODO: add attachments
    attachments?: Attachments[];
}

interface Attachments {
    filename: string;
    path: string;
}

export class EmailService {

    private transporter = nodemailer.createTransport({
        service: envsVar.MAILER_SERVICE,
        auth: {
            user: envsVar.MAILER_EMAIL,
            pass: envsVar.MAILER_EMAIL_PASSWORD
        }
    });

    constructor(
        private readonly logRepository: LogRepository,
    ) {}

    async sendMail( options: MailOptions ) {

        const { to, subject, htmlBody, attachments = [] } = options;

        try {

            await this.transporter.sendMail({
                from: envsVar.MAILER_EMAIL,
                to,
                subject,
                html: htmlBody,
                attachments
            });

            const log = new LogEntity( {
                level: LogSeverityLevel.low,
                message: 'Email sent',
                origin: 'email.service.ts'
            });
            this.logRepository.saveLog( log );
            
            return true;
        } catch (error) {
            
            const log = new LogEntity( {
                level: LogSeverityLevel.high,
                message: 'Email not sent',
                origin: 'email.service.ts'
            });
            this.logRepository.saveLog( log );
            return false;
        }
    }

    sendEmailWithFileSystemLogs ( to: string | string[] ) {

        const subject = 'Logs de sistema';
        const htmlBody = `
        <h2>Logs de sistema</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus placerat pretium lectus, id sagittis risus luctus et. Fusce at orci eget massa egestas euismod. Cras in velit eget ex tempus feugiat sit amet non justo. Nullam ullamcorper erat interdum libero gravida auctor. Pellentesque vestibulum tempus cursus. Morbi et efficitur metus. Quisque semper magna vel nibh rhoncus, eget euismod lacus tincidunt. Pellentesque at mi mi. Nulla sit amet efficitur nunc, porttitor sodales sapien. Sed quis placerat sapien, nec commodo justo. Suspendisse potenti. Fusce convallis quam vel nisi pellentesque, eu rutrum eros placerat. Cras pharetra placerat nisi. Aliquam nec lacus et nibh sagittis efficitur.            </p>
        <p>Ver logs adjuntos</p>
        `

        const attachments: Attachments[] = [
            { filename: 'low.log', path: `${process.env.PWD}/logs/low.log` },
            { filename: 'medium.log', path: `${process.env.PWD}/logs/medium.log` },
            { filename: 'high.log', path: `${process.env.PWD}/logs/high.log` }
        ];

        return this.sendMail({ to, subject, htmlBody, attachments });
    }
}