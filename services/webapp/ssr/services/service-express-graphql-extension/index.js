import { INIT_FEATURES } from '@forrestjs/hooks'
import { EXPRESS_GRAPHQL, EXPRESS_GRAPHQL_MIDDLEWARE } from '@forrestjs/service-express-graphql'
import { parseExtension } from './extension-parser'

import * as hooks from './hooks'
import registerExtensionMutation from './register-extension.mutation'
import registerExtensionJsonMutation from './register-extension-json.mutation'
import * as extensionsRegistry from './extensions-registry'

export const register = ({ registerAction, createHook }) => {
    // Preload cached extensions
    registerAction({
        hook: INIT_FEATURES,
        name: hooks.SERVICE_NAME,
        trace: __filename,
        handler: async ({ graphqlExtension = {} }) => {
            await extensionsRegistry.init(graphqlExtension)

            // boot time extension, allow to source more extensions at boot time
            await createHook(hooks.GRAPHQL_EXTENSION_INIT, {
                async: 'parallel',
                args: {
                    loadFromDisk: extensionsRegistry.loadFromDisk,
                    register: extensionsRegistry.register,
                    settings: graphqlExtension,
                },
            })
        },
    })

    // Invalidates GraphQL's middleware cache when the extensions change
    registerAction({
        hook: EXPRESS_GRAPHQL_MIDDLEWARE,
        name: hooks.SERVICE_NAME,
        trace: __filename,
        handler: ({ middlewares }) =>
            middlewares.push((req, res, next) => {
                req.bumpGraphQL(extensionsRegistry.getEtag())
                next()
            }),
    })

    // Extend GraphQL Schema
    registerAction({
        hook: EXPRESS_GRAPHQL,
        name: hooks.SERVICE_NAME,
        trace: __filename,
        handler: ({ queries, mutations }) => {
            // Add Grapi API
            mutations.registerExtension = registerExtensionMutation
            mutations.registerExtensionJSON = registerExtensionJsonMutation

            // Add Extensions
            const extensions = extensionsRegistry.getList()
            for (const definition of extensions) {
                const extension = parseExtension(definition)
                Object.keys(extension.queries).forEach(key => { queries[key] = extension.queries[key] })
                Object.keys(extension.mutations).forEach(key => { mutations[key] = extension.mutations[key] })
            }
        },
    })
}
