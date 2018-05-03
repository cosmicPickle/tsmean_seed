import { Document, Model } from "mongoose";
import { BaseDocument, IBaseModel, IBaseDocumentQuery } from "./BaseDocument";
import { AppServicePath } from "./../../AppServicePath";

export interface IGroup extends Document {
    name: string;
    allowedRoutes: string[],
    allowedServices: AppServicePath[]
}

class GroupDocument extends BaseDocument<IGroup, IBaseModel<IGroup>, IBaseDocumentQuery<any>> {
    name = 'Group';
    schema = {
        name: {
            type: String,
            required: true,
            unique: true
        },
        allowedServices: {
            type: [{
                method: String,
                path: String
            }]
        },
        allowedRoutes: {
            type: [String]
        }
    }
    methods = { }

}

export const Group = ((new GroupDocument()).model());
export default Group;
