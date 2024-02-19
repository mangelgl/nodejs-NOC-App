import 'dotenv/config';
import * as env from 'env-var';


export const envsVar = {
    PORT: env.get('PORT').required().asPortNumber(),
    MAILER_SERVICE: env.get('MAILER_SERVICE').required().asString(),
    MAILER_EMAIL: env.get('MAILER_EMAIL').required().asString(),
    MAILER_EMAIL_PASSWORD: env.get('MAILER_EMAIL_PASSWORD').required().asString(),
    STAGING: env.get('STAGING').asBool(),
}