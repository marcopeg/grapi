import { GraphQLNonNull, GraphQLObjectType } from 'graphql'
import { GraphQLID, GraphQLInt, GraphQLString } from 'graphql'
import { GraphQLDateTime } from 'graphql-iso-date'

import { login } from '../lib/login'

export default {
    description: 'Validates a user credentials and creates a JWT cookie',
    args: {
        uname: {
            type: new GraphQLNonNull(GraphQLString),
        },
        passw: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
    type: new GraphQLObjectType({
        name: 'SessionCreate',
        fields: {
            id: {
                type: new GraphQLNonNull(GraphQLID),
            },
            status: {
                type: new GraphQLNonNull(GraphQLInt),
            },
            expiry: {
                type: new GraphQLNonNull(GraphQLDateTime),
            },
            token: {
                type: new GraphQLNonNull(GraphQLString),
            },
            lastLogin: {
                type: GraphQLString,
            },
        },
    }),
    resolve: (params, args, { req, res }) =>
        login(req, res, args.uname, args.passw),
}
