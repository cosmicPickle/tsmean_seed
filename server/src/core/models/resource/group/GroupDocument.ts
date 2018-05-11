import { Document, Model } from "mongoose";
import { BaseDocument } from './../base/BaseDocument'
import * as types from './types';
import * as base from '../base/types';
import { GroupDocumentSchema } from './GroupDocumentSchema';
class GroupDocument extends BaseDocument<types.IGroup> {
    name = 'Group';
    schema = GroupDocumentSchema;
    methods = { }

}

export const Group = ((new GroupDocument()).model());
export default Group;
