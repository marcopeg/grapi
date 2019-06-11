import {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
} from 'graphql'

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
        name: 'AuthLogin',
        fields: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            token: { type: new GraphQLNonNull(GraphQLString) },
            lastLogin: { type: GraphQLString },
        },
    }),
    resolve: (params, args, { req, res }) =>
        login(req, res, args.uname, args.passw),
}
