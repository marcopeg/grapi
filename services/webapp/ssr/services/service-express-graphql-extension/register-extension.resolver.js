import { createHook } from '@forrestjs/hooks'
import { register } from './extensions-registry'
import * as hooks from './hooks'

export const registerExtensionResolver = async (extension, { req, res }) => {
    // allows to block a register action based on request informations
    await createHook(hooks.GRAPHQL_EXTENSION_VALIDATE, {
        async: 'serie',
        args: { extension, req, res },
    })

    await register(extension)

    // allows to persist an extension after it gets registered
    await createHook(hooks.GRAPHQL_EXTENSION_REGISTER, {
        async: 'serie',
        args: { extension, req, res },
    })

    return true
}
