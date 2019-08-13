import { registerExtension, reflowExtensions } from '../../services/service-express-graphql-extension'
import { getModel } from '@forrestjs/service-postgres'

export const register = async () => {
    await reflowExtensions()
    const extensions = await getModel('GraphqlExtensionRegistry').findAll({ raw: true })
    extensions.forEach(extension => registerExtension(extension.definition))
}

export const upsert = (extension, definition) =>
    getModel('GraphqlExtensionRegistry').upsert({
        extension,
        definition,
    })
