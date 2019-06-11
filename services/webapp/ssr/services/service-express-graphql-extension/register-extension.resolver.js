import { createHook } from '@forrestjs/hooks'
import { register } from './extensions-registry'
import * as hooks from './hooks'

export const registerExtensionResolver = async (extension, req) => {
    // allows to block a register action based on request informations
    await createHook(hooks.GRAPHQL_EXTENSION_VALIDATE, {
        async: 'series',
        args: { extension, req },
    })

    await register(extension)

    // allows to persist an extension after it gets registered
    await createHook(hooks.GRAPHQL_EXTENSION_REGISTER, {
        async: 'series',
        args: { extension, req },
    })

    return true
}
