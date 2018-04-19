import { Document, Model } from "mongoose";
import { BaseDocument } from "../../../core/models/db/mongo/BaseDocument";
import { AppServicePath } from "../../../core/models/AppServicePath";

export interface IGroup extends Document {
    name: string;
    allowedRoutes: string[],
    allowedServices: AppServicePath[]
}

class GroupDocument extends BaseDocument<IGroup> {
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
