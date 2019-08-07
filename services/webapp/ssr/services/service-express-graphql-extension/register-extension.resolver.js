import { register } from './extensions-registry'
import * as hooks from './hooks'

export const registerExtensionResolver = async (extension, { req, res }) => {
    const { createHook } = req.hooks

    // allows to block a register action based on request informations
    await createHook.serie(hooks.GRAPHQL_EXTENSION_VALIDATE, { extension, req, res })

    await register(extension)

    // allows to persist an extension after it gets registered
    await createHook.serie(hooks.GRAPHQL_EXTENSION_REGISTER, { extension, req, res })

    return true
}
