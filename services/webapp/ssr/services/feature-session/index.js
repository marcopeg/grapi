import { POSTGRES_BEFORE_START } from '@forrestjs/service-postgres/lib/hooks'
// import { EXPRESS_MIDDLEWARE } from '@forrestjs/service-express'
// import { EXPRESS_GRAPHQL, EXPRESS_GRAPHQL_TEST } from '@forrestjs/service-express-graphql'

import * as hooks from './hooks'
import * as sessionModel from './session.model'
import testSessionCreateMutation from './graphql/mutations/test/session-create.mutation'
import sessionQuery from './graphql/queries/session-wrapper.query'
import sessionMutation from './graphql/mutations/session-wrapper.mutation'
// import sessionMiddleware from './session.middleware'

// export { createSession, destroySession } from './session.lib'

export const register = ({ registerAction, createHook }) => {
    // Add Data Model
    registerAction({
        hook: `${POSTGRES_BEFORE_START}/default`,
        name: hooks.FEATURE_NAME,
        handler: ({ options }) => {
            options.models.push(sessionModel)
        },
    })

    // Add Express Middleware
    // registerAction({
    //     hook: '$EXPRESS_MIDDLEWARE',
    //     name: hooks.FEATURE_NAME,
    //     handler: ({ registerMiddleware }, { getConfig }) => {
    //         registerMiddleware(sessionMiddleware(getConfig('session', {})))
    //     },
    // })

    // Extends GraphQL Schema
    registerAction({
        hook: '$EXPRESS_GRAPHQL',
        name: hooks.FEATURE_NAME,
        handler: async ({ registerQuery, registerMutation }, { getConfig, createHook }) => {
            const {
                wrapperName = 'session',
                wrapperDescription = 'Provides informations about the running session',
                queryName = 'SessionQuery',
                mutationName = 'SessionMutation',
                queries = {},
                mutations = {},
            } = getConfig('session', {})

            // Extend the existing schema with custom queries and mutations
            await createHook.serie(hooks.EXPRESS_GRAPHQL_TEST, {
                registerQuery: (key, val) => {
                    if (queries[key]) {
                        throw new Error(`[session] Query "${key}" was already defined`)
                    }
                    queries[key] = val
                },
                registerMutation: (key, val) => {
                    if (queries[key]) {
                        throw new Error(`[session] Mutation "${key}" was already defined`)
                    }
                    mutations[key] = val
                },
            })

            registerQuery(wrapperName, await sessionQuery({
                name: queryName,
                description: wrapperDescription,
                fields: queries,
            }))

            registerMutation(wrapperName, await sessionMutation({
                name: mutationName,
                description: wrapperDescription,
                fields: mutations,
            }))
        },
    })

    // Extends Testing GraphQL Schema
    registerAction({
        hook: '$EXPRESS_GRAPHQL_TEST',
        name: hooks.FEATURE_NAME,
        handler: async ({ registerMutation }) => {
            registerMutation('createSession', await testSessionCreateMutation())
        },
    })
}
