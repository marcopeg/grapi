import {
    GraphQLNonNull,
    GraphQLString,
} from 'graphql'

import { createNamespace } from './graphql-namespace.lib'

export default {
    description: 'Reserves a new namespace tied to the session user',
    args: {
        namespace: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
    type: new GraphQLNonNull(GraphQLString),
    resolve: async (_, args, { req, res }) => {
        const accountId = req.auth.account.data.id
        await createNamespace({ ...args, accountId }, req, res)
        return 'foo'
    },
}
