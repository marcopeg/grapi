import GraphQLJSON from 'graphql-type-json'
import { destroyAllSessions } from '../../../../auth-account.lib'

// @TODO: add a type here
export default () => ({
    description: 'Logout any active session for the current user',
    type: GraphQLJSON,
    resolve: (params, args, { req, res }) => {
        return destroyAllSessions({ find: req.auth.account.data.id }, req, res)
    },
})
