import Sequelize from 'sequelize'
import { POSTGRES_BEFORE_START } from '@forrestjs/service-postgres/lib/hooks'
import * as hooks from './hooks'
import * as graphqlToken from './graphql-token.lib'
import graphqlTokenMutation from './graphql-token.mutation'

// Sequelize Models
import * as graphqlTokenModel from './graphql-token.model'

export const register = ({ registerHook, registerAction }) => {
    registerHook(hooks)

    // register database models
    registerAction({
        hook: `${POSTGRES_BEFORE_START}/default`,
        name: hooks.FEATURE_NAME,
        handler: ({ registerModel }) =>
            registerModel(graphqlTokenModel),
    })

    // validates a request to upsert an extension using a JWT as
    // provided in "Authorization: Bearer xxx" header
    registerAction({
        hook: '$GRAPHQL_EXTENSION_VALIDATE',
        name: hooks.FEATURE_NAME,
        handler: async ({ extension, req }) => {
            const token = req.headers['authorization'].split('Bearer').pop().trim()
            req.graphqlToken = await graphqlToken.validate({ token, extension })
        },
    })

    // this is supposed to regulate access to a single extension's method
    // request by request
    registerAction({
        hook: 'GRAPHQL_EXTENSION_RESOLVE',
        handler: (a) => {
            console.log(a)
        },
    })

    registerAction({
        hook: '$EXPRESS_GRAPHQL_TEST',
        name: hooks.FEATURE_NAME,
        handler: async ({ registerMutation }) => {
            registerMutation('createGraphqlExtensionToken', graphqlTokenMutation)
        },
    })
}
