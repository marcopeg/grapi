import { GraphQLNonNull, GraphQLString } from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import { destroyAllSessions } from '../../../auth-account.lib'

export default () => ({
    description: 'Logout all the session connected to an AuthAccount',
    args: {
        find: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
    type: GraphQLJSON,
    resolve: (params, args, { req, res }) => destroyAllSessions({ ...args }, req, res),
})
