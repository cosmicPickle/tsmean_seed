import { mongoose } from './../../../../configuration/db/mongo';
import { userPostBodySchema } from './validation';

export const UserDocumentSchema = {
    username: {
        type: String,
        required: true,
        unique: true,
        validate: {
            isAsync: true,
            validator: function(val, cb)  {
                const {error, value} = userPostBodySchema.username.validate(val);
                cb(!error, JSON.stringify(error))
            },
            message: null
        }
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