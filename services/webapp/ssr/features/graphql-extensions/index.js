import { POSTGRES_BEFORE_START } from '@forrestjs/service-postgres/lib/hooks'
import { GRAPHQL_EXTENSION_START } from '../../services/service-express-graphql-extension/hooks'
import { GRAPHQL_EXTENSION_REGISTER } from '../../services/service-express-graphql-extension/hooks'
import { POSTGRES_PUBSUB_START, publish } from '@forrestjs/service-postgres-pubsub'
import { getModel } from '@forrestjs/service-postgres'
import { bumpGraphqlETAG } from '@forrestjs/service-express-graphql'
import { registerExtension } from '../../services/service-express-graphql-extension'
import { FEATURE_NAME } from './hooks'
import * as graphqlExtension from './graphql-extension.model'

const REGISTER_EXTENSION_MSG = 'registerExtension'

const flowDatabaseExtensions = async () => {
    const extensions = await getModel('GraphqlExtension').findAll({ raw: true })
    extensions.forEach(extension => registerExtension(extension.definition))
}

const upsertDatabaseExtension = extension =>
    getModel('GraphqlExtension').upsert({
        namespace: extension.name,
        definition: extension,
    })

export const register = ({ registerAction }) => {
    // register database models
    registerAction({
        hook: `${POSTGRES_BEFORE_START}/default`,
        name: FEATURE_NAME,
        handler: ({ options }) => {
            options.models.push(graphqlExtension)
        },
    })

    // load all available extensions at boot time
    registerAction({
        hook: GRAPHQL_EXTENSION_START,
        name: FEATURE_NAME,
        handler: flowDatabaseExtensions,
    })

    // persist an exension in the database and emit a signal so that
    // other service instances can reflow the models
    registerAction({
        hook: GRAPHQL_EXTENSION_REGISTER,
        name: FEATURE_NAME,
        handler: async ({ extension }) => {
            await upsertDatabaseExtension(extension)
            publish(REGISTER_EXTENSION_MSG, extension.name)
        },
    })

    // listen to variations in the schema from the pub/sub
    // and bump the local GraphQL ETAG to force the schema to update
    registerAction({
        hook: POSTGRES_PUBSUB_START,
        name: FEATURE_NAME,
        handler: ({ addChannel }) =>
            addChannel(REGISTER_EXTENSION_MSG, async () => {
                await flowDatabaseExtensions()
                bumpGraphqlETAG()
            }),
    })
}
