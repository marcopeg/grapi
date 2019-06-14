import { GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLID } from 'graphql'
import { find } from '../../../auth-account.lib'

export default () => ({
    description: 'Finds out whether an account exists by a unique ref',
    args: {
        find: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
    type: new GraphQLObjectType({
        name: 'AuthAccountExists',
        fields: {
            id: {
                type: new GraphQLNonNull(GraphQLID),
            },
            uname: {
                type: new GraphQLNonNull(GraphQLString),
            },
        },
    }),
    resolve: (params, args, { req, res }) => find(args, req, res),
})
