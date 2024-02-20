import { PrismaClient } from "@prisma/client";
import { envsVar } from "./config/plugins/dotenv.plugin";
import { LogModel, MongoDatabase } from "./data/mongo";
import { Server } from "./presentation/server";

(async() => {
    await main();
})();

async function main() {
    
    await MongoDatabase.connect({
        url: envsVar.MONGO_URL,
        databaseName: envsVar.MONGO_DB_NAME
    });

    // const prisma = new PrismaClient();

    Server.run();
}