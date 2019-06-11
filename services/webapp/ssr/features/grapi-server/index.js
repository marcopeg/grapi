import { INIT_FEATURES } from '@forrestjs/hooks'
import { EXPRESS_GRAPHQL, EXPRESS_GRAPHQL_MIDDLEWARE } from '@forrestjs/service-express-graphql'
import { parseExtension } from 'graphql-extension'

import { FEATURE_NAME } from './hooks'
import registerExtensionMutation from './register-extension.mutation'
import * as extensionsRegistry from './extensions-registry'

export const register = ({ registerAction }) => {
    // Preload cached extensions
    registerAction({
        hook: INIT_FEATURES,
        name: FEATURE_NAME,
        trace: __filename,
        handler: extensionsRegistry.init,
    })

    // Extend GraphQL Schema
    registerAction({
        hook: EXPRESS_GRAPHQL,
        name: FEATURE_NAME,
        trace: __filename,
        handler: ({ queries, mutations }) => {
            // Add Grapi API
            mutations.registerExtension = registerExtensionMutation

            // Add Extensions
            const extensions = extensionsRegistry.getList()
            for (const definition of extensions) {
                const extension = parseExtension(definition)
                Object.keys(extension.queries).forEach(key => { queries[key] = extension.queries[key] })
                Object.keys(extension.mutations).forEach(key => { mutations[key] = extension.mutations[key] })
            }
        },
    })

    // Invalidates GraphQL's middleware cache when the extensions change
    registerAction({
        hook: EXPRESS_GRAPHQL_MIDDLEWARE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: ({ middlewares }) =>
            middlewares.push((req, res, next) => {
                req.bumpGraphQL(extensionsRegistry.getEtag())
                next()
            }),
    })
}
