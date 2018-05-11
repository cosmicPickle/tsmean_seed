export const GroupDocumentSchema = {
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