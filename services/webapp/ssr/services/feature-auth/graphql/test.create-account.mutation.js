import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import { createTestUser } from '../lib/test'

export default {
    description: 'Creates a brand new Auth account',
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
        createTestUser({ ...args }),
}
