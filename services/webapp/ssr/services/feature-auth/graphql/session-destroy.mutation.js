import { GraphQLNonNull, GraphQLBoolean } from 'graphql'
import { logout } from '../lib/login'

export default {
    type: new GraphQLNonNull(GraphQLBoolean),
    description: 'Drop a running session',
    resolve: (params, args, { req, res }) => logout(req, res),
}
