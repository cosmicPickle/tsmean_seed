import { Document, Model } from "mongoose";
import { BaseModel } from "../../../core/models/db/mongo/BaseModel";

export interface IGroup extends Document {
    name: string;
    allowedServices: string[];
    allowedRoutes: string[];
    guardService(service: string) : boolean;
    guardRoute(route: string): boolean
}

class GroupModel extends BaseModel<IGroup> {
    _name = 'Group';
    _schema = {
        name: {
            type: String,
            required: true,
        },
        allowedServices: {
            type: [String],
            //TODO: Write validation method:path:arguments (optional {{argument}})
        },
        allowedRoutes: {
            type: [String]
        }
    }
    _methods = {
        guardService: function(service: string): boolean {

            //We have an exact match of service
            if(this.allowedServices.indexOf(service) >= 0) 
                return true;

            //TODO: Check for parametised service

        },

        guardRoute: function(route: string): boolean {
            
            //We have an exact match of route
            if(this.allowedServices.indexOf(route) >= 0) 
                return true;

            //TODO: Check for parametised route

        }
    }

}

export const Group = ((new GroupModel()).model());
export default Group;
