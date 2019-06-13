import { GraphQLBoolean } from 'graphql'
import { destroySession } from './session.lib'

export default async () => ({
    description: 'Destroy a running session',
    type: GraphQLBoolean,
    resolve: (params, args, { req, res }) => destroySession(args, req, res),
})
