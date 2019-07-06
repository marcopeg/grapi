import { EXPRESS_GRAPHQL, EXPRESS_GRAPHQL_TEST } from '@forrestjs/service-express-graphql'
import { SESSION_GRAPHQL } from '../../feature-session/hooks'

import { FEATURE_NAME, AUTH_GRAPHQL, AUTH_SESSION_GRAPHQL } from '../hooks'

import authMutation from '../graphql/mutations/auth-wrapper.mutation'
import authQuery from '../graphql/queries/auth-wrapper.query'
import authSessionQuery from '../graphql/queries/session/auth-wrapper.query'
import authSessionMutation from '../graphql/mutations/session/auth-wrapper.mutation'
import testCreateAccountMutation from '../graphql/mutations/test/create-account.mutation'
import testUpdateAccountMutation from '../graphql/mutations/test/update-account.mutation'
import testLogoutAccountMutation from '../graphql/mutations/test/logout-account.mutation'

export default ({ registerAction, createHook }) => {
    // Extends GraphQL Schema
    registerAction({
        hook: EXPRESS_GRAPHQL,
        name: FEATURE_NAME,
        handler: async ({ queries, mutations }) => {
            // collect queries and mutations that needs session validation
            const authQueries = {}
            const authMutations = {}
            await createHook(AUTH_GRAPHQL, {
                async: 'serie',
                args: {
                    // queries: authQueries,
                    mutations: authMutations,
                },
            })

            // extend the general schema
            queries.auth = await authQuery(authQueries)
            mutations.auth = await authMutation(authMutations)
        },
    })

    // Extends GraphQL Session Schema
    registerAction({
        hook: SESSION_GRAPHQL,
        name: FEATURE_NAME,
        handler: async ({ queries, mutations }) => {
            // collect queries and mutations that needs session validation
            const authQueries = {}
            const authMutations = {}
            await createHook(AUTH_SESSION_GRAPHQL, {
                async: 'serie',
                args: {
                    queries: authQueries,
                    mutations: authMutations,
                },
            })

            // extend the general schema
            queries.auth = await authSessionQuery(authQueries)
            mutations.auth = await authSessionMutation(authMutations)
        },
    })

    // Extends Testing GraphQL Schema
    registerAction({
        hook: EXPRESS_GRAPHQL_TEST,
        name: FEATURE_NAME,
        handler: async ({ mutations }) => {
            mutations.createAccount = await testCreateAccountMutation()
            mutations.updateAccount = await testUpdateAccountMutation()
            mutations.logoutAccount = await testLogoutAccountMutation()
        },
    })
}