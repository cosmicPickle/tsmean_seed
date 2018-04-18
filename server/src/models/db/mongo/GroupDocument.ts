import { Document, Model } from "mongoose";
import { BaseDocument } from "../../../core/models/db/mongo/BaseDocument";

export interface IGroup extends Document {
    name: string;
    allowedServices: string[];
    allowedRoutes: string[];
    guardService(service: string) : boolean;
    guardRoute(route: string): boolean
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
            type: [String],
            //TODO: Write validation method:path:arguments (optional {{argument}})
        },
        allowedRoutes: {
            type: [String]
        }
    }
    methods = {
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

export const Group = ((new GroupDocument()).model());
export default Group;
