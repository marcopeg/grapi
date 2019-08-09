import * as hooks from './hooks'
// import { validateGraphqlToken } from '../graphql-extensions-manager'
import { getRules } from '../../services/service-express-graphql-extension'

import decorateMeta from './meta'
import applyRules from './rules'

export const register = ({ registerHook, registerAction }) => {
    registerHook(hooks)

    // this is supposed to regulate access to a single extension's method request by request
    registerAction({
        hook: 'GRAPHQL_EXTENSION_RESOLVE',
        handler: async ({ extension, method, type, source, graphql }) => {
            // Decorate the resolver variables with meta informations regarding the current request
            const meta = {
                extension,
                method,
                type,
            }

            // Collect meta informations and apply the validation rules
            await decorateMeta(meta, graphql)
            await applyRules(getRules(extension), meta, graphql)

            // Decorate the resolver's arguments so that those info can be used by the extension's definition
            graphql.args.__meta = meta
        },
    })
}
