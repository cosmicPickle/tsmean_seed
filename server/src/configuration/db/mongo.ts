import * as mongoose from "mongoose";
import { Mongoose } from "mongoose";

export const mongoConfig = {
    host: 'ds223019.mlab.com:23019/test_seed',
    user: 'cosmicSeed',
    password: 'csmsd123'
}

const connect: string = `mongodb://${mongoConfig.user}:${mongoConfig.password}@${mongoConfig.host}`;
const options = <any>{ autoIndex: false };
const db = mongoose.connect(connect, options);

export { mongoose };