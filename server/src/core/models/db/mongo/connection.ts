import * as mongoose from "mongoose";
import { mongoConfig as config} from "./../../../../configuration/db/mongo";
import { Mongoose } from "mongoose";


const connect: string = `mongodb://${config.user}:${config.password}@${config.host}`;
const options = <any>{ autoIndex: false };
const db = mongoose.connect(connect, options);

export { mongoose }