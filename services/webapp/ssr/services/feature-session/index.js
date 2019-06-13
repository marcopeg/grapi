import { POSTGRES_BEFORE_START } from '@forrestjs/service-postgres/lib/hooks'
import { EXPRESS_GRAPHQL, EXPRESS_GRAPHQL_TEST } from '@forrestjs/service-express-graphql'

import { FEATURE_NAME, SESSION_GRAPHQL } from './hooks'
import * as sessionModel from './session.model'
import testSessionCreateMutation from './test.session-create.mutation'
import sessionQuery from './session.query'

export const register = ({ registerAction, createHook }) => {
    registerAction({
        hook: `${POSTGRES_BEFORE_START}/default`,
        name: FEATURE_NAME,
        handler: ({ options }) => {
            options.models.push(sessionModel)
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
            await createHook(SESSION_GRAPHQL, {
                async: 'serie',
                args: {
                    queries: sessionQueries,
                    mutations: sessionMutations,
                },
            })

            // extend the general schema
            queries.session = await sessionQuery(sessionQueries)
            // mutations.session = await sessionMutation(sessionMutations)
            // mutations.sessionCreate = sessionCreateMutation
        },
    })

    // Extends Testing GraphQL Schema
    registerAction({
        hook: EXPRESS_GRAPHQL_TEST,
        name: FEATURE_NAME,
        handler: async ({ mutations }) => {
            mutations.createSession = await testSessionCreateMutation()
            // mutations.destroySession = testSessionDestroyMutation()
        },
    })
}
