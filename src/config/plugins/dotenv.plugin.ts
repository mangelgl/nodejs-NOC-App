import 'dotenv/config';
import * as env from 'env-var';


export const envsVar = {
    PORT: env.get('PORT').required().asPortNumber(),
    STAGING: env.get('STAGING').asBool(),
    
    // Mailer
    MAILER_SERVICE: env.get('MAILER_SERVICE').required().asString(),
    MAILER_EMAIL: env.get('MAILER_EMAIL').required().asString(),
    MAILER_EMAIL_PASSWORD: env.get('MAILER_EMAIL_PASSWORD').required().asString(),

    // Mongo db
    MONGO_URL: env.get('MONGO_URL').required().asString(),
    MONGO_DB_NAME: env.get('MONGO_DB_NAME').required().asString(),
    MONGO_USER: env.get('MONGO_USER').required().asString(),
    MONGO_PASSWORD: env.get('MONGO_PASSWORD').required().asString(),
}