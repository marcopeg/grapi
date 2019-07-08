import { POSTGRES_BEFORE_START } from '@forrestjs/service-postgres/lib/hooks'
import * as hooks from './hooks'
import * as authAccountModel from './auth-account.model'
import { testCreateAccountMutation } from './graphql/mutations/test/create-account.mutation'
import { loginMutation } from './graphql/mutations/login.mutation'

export default ({ registerHook, registerAction }) => {
    registerHook(hooks)

    // Add Data Model
    registerAction({
        hook: `${POSTGRES_BEFORE_START}/default`,
        name: hooks.FEATURE_NAME,
        handler: ({ registerModel }) => {
            registerModel(authAccountModel)
        },
    })

    // Extends GraphQL Schema
    registerAction({
        hook: '$EXPRESS_GRAPHQL',
        name: hooks.FEATURE_NAME,
        handler: async ({ registerMutation }) => {
            registerMutation('login', await loginMutation())
        },
    })

    // Extends Testing GraphQL Schema
    registerAction({
        hook: '$EXPRESS_GRAPHQL_TEST',
        name: hooks.FEATURE_NAME,
        handler: async ({ registerMutation }) => {
            registerMutation('createAccount', await testCreateAccountMutation())
        },
    })
}
