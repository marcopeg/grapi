import {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLID,
    GraphQLInt,
} from 'graphql'

import { GraphQLDateTime } from 'graphql-iso-date'

import { validateSession } from '../lib/session'

export default {
    description: 'Validates a session and extends the expiration',
    type: new GraphQLObjectType({
        name: 'AuthVerifiedSession',
        fields: {
            id: {
                type: new GraphQLNonNull(GraphQLID),
            },
            status: {
                type: new GraphQLNonNull(GraphQLInt),
            },
            created: {
                type: new GraphQLNonNull(GraphQLDateTime),
            },
            expiry: {
                type: new GraphQLNonNull(GraphQLDateTime),
            },
        },
    }),
    resolve: (params, args, { req, res }) =>
        validateSession(req, res),
}
