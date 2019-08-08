import { POSTGRES_BEFORE_START } from '@forrestjs/service-postgres/lib/hooks'
import { publish } from '@forrestjs/service-postgres-pubsub'
import * as hooks from './hooks'
import graphqlTokenMutation from './graphql-token.mutation'

// Libraries
import * as graphqlToken from './graphql-token.lib'
import * as graphqlExtension from './graphql-extension.lib'

// Sequelize Models
import * as graphqlExtensionModel from './graphql-extension.model'
// import * as graphqlTokenModel from './graphql-token.model'

const REGISTER_EXTENSION_MSG = 'registerExtension'

export const issueExtensionToken = graphqlToken.issue

export const register = ({ registerHook, registerAction }) => {
    registerHook(hooks)

    // register database models
    registerAction({
        hook: `${POSTGRES_BEFORE_START}/default`,
        name: hooks.FEATURE_NAME,
        handler: ({ registerModel }) => {
            registerModel(graphqlExtensionModel)
            // registerModel(graphqlTokenModel)
        },
    })

    // load all available extensions at boot time
    registerAction({
        hook: '$GRAPHQL_EXTENSION_START',
        name: hooks.FEATURE_NAME,
        handler: graphqlExtension.register,
    })

    // validates a request to upsert an extension using a JWT as
    // provided in "Authorization: Bearer xxx" header
    // registerAction({
    //     hook: '$GRAPHQL_EXTENSION_VALIDATE',
    //     name: hooks.FEATURE_NAME,
    //     handler: async ({ extension, req }) => {
    //         const token = req.headers['authorization'].split('Bearer').pop().trim()
    //         req.graphqlToken = await graphqlToken.validate({ token, extension })
    //     },
    // })

    // persist an exension in the database and emit a signal so that
    // other service instances can reflow the models
    registerAction({
        hook: '$GRAPHQL_EXTENSION_REGISTER',
        name: hooks.FEATURE_NAME,
        handler: async ({ extension, req }) => {
            await graphqlExtension.upsert(extension)
            // await graphqlToken.bump(req.graphqlToken.payload.id)
            publish(REGISTER_EXTENSION_MSG, extension.name)
        },
    })

    // listen to variations in the schema from the pub/sub
    // force the reflow of the registry
    registerAction({
        hook: '$POSTGRES_PUBSUB_START',
        optional: true,
        name: hooks.FEATURE_NAME,
        handler: ({ addChannel }) =>
            addChannel(REGISTER_EXTENSION_MSG, graphqlExtension.register),
    })

    registerAction({
        hook: '$EXPRESS_GRAPHQL_TEST',
        name: hooks.FEATURE_NAME,
        handler: async ({ registerMutation }) => {
            registerMutation('createGraphqlExtensionToken', graphqlTokenMutation)
        },
    })
}
