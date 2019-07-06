import { GraphQLObjectType } from 'graphql'

import { findSessionAccount } from '../../../auth-account.lib'
import logoutAllMutation from './auth/logout-all.mutation'

export default async (mutations = {}) => ({
    description: 'Wraps Auth\'s Session dependent mutations',
    type: new GraphQLObjectType({
        name: 'AuthSessionMutation',
        fields: {
            logoutAll: await logoutAllMutation(),
            ...mutations,
        },
    }),
    resolve: (_, args, { req, res }) => findSessionAccount(args, req, res),
})
