import { before } from "mocha";
import { logger } from "./core/lib/AppLogger";
import { mongo } from './core/lib/AppMongoDriver';

before(async () => {
   await mongo.connect();
});

after(() => {
    mongo.close();
})