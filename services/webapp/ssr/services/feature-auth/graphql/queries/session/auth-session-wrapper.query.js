import { GraphQLObjectType } from 'graphql'

import { findSessionAccount } from '../../../auth-account.lib'
import meQuery from './auth/me.query'

export default async (queries = {}) => ({
    description: 'Wraps Auth\'s Session dependent queries',
    type: new GraphQLObjectType({
        name: 'AuthSessionQuery',
        fields: {
            me: await meQuery(),
            ...queries,
        },
    }),
    resolve: (_, args, { req, res }) => findSessionAccount(args, req, res),
})
