import { mongoose } from './../../../../configuration/db/mongo';
import * as Joi from 'joi';

export const UserDocumentSchema = {
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Group',
        required: true,
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