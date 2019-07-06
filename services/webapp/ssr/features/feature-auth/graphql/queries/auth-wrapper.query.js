import { GraphQLObjectType } from 'graphql'

import accountExistsQuery from './auth/account-exists.query'

export default async (queries = {}) => ({
    description: 'Wraps Auth dependent queries',
    type: new GraphQLObjectType({
        name: 'AuthQuery',
        fields: {
            accountExists: await accountExistsQuery(),
            ...queries,
        },
    }),
    resolve: () => ({}),
})
