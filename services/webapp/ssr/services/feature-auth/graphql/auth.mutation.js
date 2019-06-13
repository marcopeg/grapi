import { GraphQLNonNull, GraphQLObjectType, GraphQLID, GraphQLInt, GraphQLString } from 'graphql'
import { GraphQLDateTime } from 'graphql-iso-date'
import { validateSession } from '../lib/session'

export default {
    description: 'Validates a session and extends the expiration',
    args: {
        token: {
            type: GraphQLString,
        },
    },
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
            token: {
                type: new GraphQLNonNull(GraphQLString),
            },
        },
    }),
    resolve: (params, args, { req, res }) => validateSession({ ...args, req, res }),
}
