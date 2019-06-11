import { FEATURE } from '@forrestjs/hooks'
import * as account from './account.model'
import sessionQuery from './graphql/session.query'
import sessionMutation from './graphql/session.mutation'
import authMutation from './graphql/auth.mutation'
import loginMutation from './graphql/login.mutation'
import createTestUserMutation from './graphql/test.create-user.mutation'
import updateTestUserMutation from './graphql/test.update-user.mutation'
import { shouldRender, getCacheKey } from './lib/ssr'

// list of hooks that I plan to use here
import { EXPRESS_MIDDLEWARE } from '@forrestjs/service-express'
import { EXPRESS_GRAPHQL, EXPRESS_GRAPHQL_TEST } from '@forrestjs/service-express-graphql'
import { EXPRESS_SSR } from '@forrestjs/service-express-ssr'
import { POSTGRES_BEFORE_START } from '@forrestjs/service-postgres/lib/hooks'
import { getSessionMiddleware } from './lib/session'

const FEATURE_NAME = `${FEATURE} auth`

export const register = ({ registerAction }) => {
    registerAction({
        hook: `${POSTGRES_BEFORE_START}/default`,
        name: FEATURE_NAME,
        handler: ({ options }) => {
            options.models.push(account)
        },
    })

    registerAction({
        hook: EXPRESS_GRAPHQL,
        name: FEATURE_NAME,
        handler: async ({ queries, mutations }) => {
            queries.session = await sessionQuery()
            mutations.session = await sessionMutation()
            mutations.auth = authMutation
            mutations.login = loginMutation
        },
    })

    registerAction({
        hook: EXPRESS_GRAPHQL_TEST,
        name: FEATURE_NAME,
        handler: async ({ queries, mutations }) => {
            mutations.createAuthUser = createTestUserMutation
            mutations.updateAuthUser = updateTestUserMutation
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
