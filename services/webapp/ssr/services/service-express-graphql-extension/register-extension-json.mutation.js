/**
 * Reverse wrapper that allows to define a simple JSON document
 * as extension.
 *
 * This should be used mostly for development or demonstrational pourpose.
 */

import { GraphQLNonNull, GraphQLString } from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import { registerExtensionResolver } from './register-extension.resolver'

export default () => ({
    description: 'Register or updates an GraphQL Extension using a JSON document as definition',
    args: {
        definition: {
            type: new GraphQLNonNull(GraphQLJSON),
        },
        rules: {
            type: GraphQLJSON,
            defaultValue: {},
        },
        token: {
            type: GraphQLString,
            defaultValue: null,
        },
    },
    type: GraphQLJSON,
    resolve: (_, args, req) => registerExtensionResolver(args, req),
})
