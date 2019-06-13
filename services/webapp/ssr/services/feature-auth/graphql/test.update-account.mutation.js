import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import { updateTestUser } from '../lib/test'

export default {
    description: 'Updates and existing Auth account',
    args: {
        uname: {
            type: new GraphQLNonNull(GraphQLString),
        },
        passw: {
            type: GraphQLString,
        },
        status: {
            type: GraphQLInt,
        },
    },
    type: GraphQLJSON,
    resolve: (params, args, { req, res }) =>
        updateTestUser(args.uname, { ...args }),
}
