import { POSTGRES_BEFORE_START } from '@forrestjs/service-postgres/lib/hooks'
import { EXPRESS_MIDDLEWARE } from '@forrestjs/service-express'
import { EXPRESS_GRAPHQL, EXPRESS_GRAPHQL_TEST } from '@forrestjs/service-express-graphql'

import { FEATURE_NAME, SESSION_GRAPHQL } from './hooks'
import * as sessionModel from './session.model'
import testSessionCreateMutation from './graphql/mutations/test/session-create.mutation'
import sessionQuery from './graphql/queries/session-wrapper.query'
import sessionMutation from './graphql/mutations/session-wrapper.mutation'
import sessionMiddleware from './session.middleware'

export { createSession, destroySession } from './session.lib'

export const register = ({ registerAction, createHook }) => {
    // Add Data Model
    registerAction({
        hook: `${POSTGRES_BEFORE_START}/default`,
        name: FEATURE_NAME,
        handler: ({ options }) => {
            options.models.push(sessionModel)
        },
    })

    // Add Express Middleware
    registerAction({
        hook: EXPRESS_MIDDLEWARE,
        name: FEATURE_NAME,
        handler: ({ app, settings }) =>
            app.use(sessionMiddleware(settings.session)),
    })

    // Extends GraphQL Schema
    registerAction({
        hook: EXPRESS_GRAPHQL,
        name: FEATURE_NAME,
        handler: async ({ queries, mutations }) => {
            // collect queries and mutations that needs session validation
            const sessionQueries = {}
            const sessionMutations = {}
            await createHook(SESSION_GRAPHQL, {
                async: 'serie',
                args: {
                    queries: sessionQueries,
                    mutations: sessionMutations,
                },
            })

            // extend the general schema
            queries.session = await sessionQuery(sessionQueries)
            mutations.session = await sessionMutation(sessionMutations)
        },
    })

    // Extends Testing GraphQL Schema
    registerAction({
        hook: EXPRESS_GRAPHQL_TEST,
        name: FEATURE_NAME,
        handler: async ({ mutations }) => {
            mutations.createSession = await testSessionCreateMutation()
        },
    })
}
