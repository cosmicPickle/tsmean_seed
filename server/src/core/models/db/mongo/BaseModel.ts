
import { Document, Model, Schema, Mongoose } from "mongoose";
import { mongoose } from './connection';

export type BaseModelMethods = {
    [propName: string] : (...args: any[]) => any
}

export interface IBaseModel {
    _name: string,
    _schema: any,
    _methods: BaseModelMethods;
}
export class BaseModel<T extends Document> implements IBaseModel {

    _name: string;
    _schema: any;
    _methods: BaseModelMethods;
    protected schema: Schema;

    model(): Model<T> {

        this.schema = new Schema(this._schema);
        this.schema.methods = this._methods;
        
        return mongoose.model<T>(this._name, this.schema);
    }
}

export default BaseModel;