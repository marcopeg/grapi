import { registerExtension, reflowExtensions } from '../../services/service-express-graphql-extension'
import { getModel } from '@forrestjs/service-postgres'

export const register = async () => {
    await reflowExtensions()
    const extensions = await getModel('GraphqlExtensionRegistry').findAll({ raw: true })
    extensions.forEach(extension => registerExtension(extension.definition, extension.rules))
}

export const upsert = (definition, rules) =>
    getModel('GraphqlExtensionRegistry').upsert({
        namespace: definition.name,
        definition,
        rules,
    })
