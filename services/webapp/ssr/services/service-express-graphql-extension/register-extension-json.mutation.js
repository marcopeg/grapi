/**
 * Reverse wrapper that allows to define a simple JSON document
 * as extension.
 *
 * This should be used mostly for development or demonstrational pourpose.
 */

import { GraphQLNonNull } from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import { reverseParseExtension } from './extension-parser'
import { registerExtensionResolver } from './register-extension.resolver'

export default {
    description: 'Register or updates an GraphQL Extension',
    args: {
        definition: {
            type: new GraphQLNonNull(GraphQLJSON),
        },
    },
    type: GraphQLJSON,
    resolve: (_, args, req) => {
        const definition = reverseParseExtension(args.definition)
        return registerExtensionResolver(_, { definition }, req)
    },
}
