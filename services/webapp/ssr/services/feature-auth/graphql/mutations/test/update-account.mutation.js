import { GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import { update } from '../../../auth-account.lib'

export default () => ({
    description: 'Updates an AuthAccount using username or ID as identifiers',
    args: {
        find: {
            type: new GraphQLNonNull(GraphQLString),
        },
        uname: {
            type: GraphQLString,
        },
        passw: {
            type: GraphQLString,
        },
        status: {
            type: GraphQLInt,
        },
        payload: {
            type: GraphQLJSON,
        },
        bumpEtag: {
            type: GraphQLBoolean,
        },
    },
    type: GraphQLJSON,
    resolve: (params, args, { req, res }) => update({ ...args }, req, res),
})
