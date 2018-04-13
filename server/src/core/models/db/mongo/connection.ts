import * as mongoose from "mongoose";
import { mongoConfig as config} from "./../../../../configuration/db/mongo";
import { resolve } from "dns";

const connect: string = `mongodb://${config.user}:${config.password}@${config.host}`;

mongoose.connect(connect);

export { mongoose };