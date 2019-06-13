import * as account from './account.model'
import sessionQuery from './graphql/session.query'
import sessionMutation from './graphql/session.mutation'
import sessionCreateMutation from './graphql/session-create.mutation'
import createAccountMutation from './graphql/test.create-account.mutation'
import updateAccountMutation from './graphql/test.update-account.mutation'
import { shouldRender, getCacheKey } from './lib/ssr'

// list of hooks that I plan to use here
import { EXPRESS_MIDDLEWARE } from '@forrestjs/service-express'
import { EXPRESS_GRAPHQL, EXPRESS_GRAPHQL_TEST } from '@forrestjs/service-express-graphql'
import { EXPRESS_SSR } from '@forrestjs/service-express-ssr'
import { POSTGRES_BEFORE_START } from '@forrestjs/service-postgres/lib/hooks'
import { getSessionMiddleware } from './lib/session'

import { FEATURE_NAME, AUTH_GRAPHQL } from './hooks'

export const register = ({ registerAction, createHook }) => {
    registerAction({
        hook: `${POSTGRES_BEFORE_START}/default`,
        name: FEATURE_NAME,
        handler: ({ options }) => {
            options.models.push(account)
        },
    })

    // Extends GraphQL Schema
    registerAction({
        hook: EXPRESS_GRAPHQL,
        name: FEATURE_NAME,
        handler: async ({ queries, mutations }) => {
            // collect queries and mutations that needs session validation
            const sessionQueries = {}
            const sessionMutations = {}
            await createHook(AUTH_GRAPHQL, {
                async: 'serie',
                args: {
                    queries: sessionQueries,
                    mutations: sessionMutations,
                },
            })

            // extend the general schema
            queries.session = await sessionQuery(sessionQueries)
            mutations.session = await sessionMutation(sessionMutations)
            mutations.sessionCreate = sessionCreateMutation
        },
    })

    // Extends Testing GraphQL Schema
    registerAction({
        hook: EXPRESS_GRAPHQL_TEST,
        name: FEATURE_NAME,
        handler: async ({ mutations }) => {
            mutations.createAccount = createAccountMutation
            mutations.updateAccount = updateAccountMutation
        },
    })

    registerAction({
        hook: EXPRESS_MIDDLEWARE,
        name: FEATURE_NAME,
        handler: ({ app }) => app.use(getSessionMiddleware()),
    })

    registerAction({
        hook: EXPRESS_SSR,
        name: FEATURE_NAME,
        handler: ({ options }) => {
            options.shouldRender = shouldRender
            options.getCacheKey = getCacheKey
        },
    })
}
