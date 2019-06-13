import { GraphQLObjectType, GraphQLString } from 'graphql'
import { getSession } from '../lib/session'

import sessionRefreshMutation from './session-refresh.mutation'
import sessionDestroyMutation from './session-destroy.mutation'

export default async mutations => ({
    description: 'Wraps session dependent mutations',
    args: {
        token: {
            type: GraphQLString,
        },
    },
    type: new GraphQLObjectType({
        name: 'SessionMutation',
        fields: {
            refresh: sessionRefreshMutation,
            destroy: sessionDestroyMutation,
            ...mutations,
        },
    }),
    resolve: (params, args, { req, res }) => getSession({ ...args, req, res }),
})
