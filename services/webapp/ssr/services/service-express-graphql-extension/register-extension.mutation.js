
import { GraphQLBoolean, GraphQLNonNull } from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import { registerExtensionResolver } from './register-extension.resolver'

export default {
    description: 'Register or updates an GraphQL Extension',
    args: {
        definition: {
            type: new GraphQLNonNull(GraphQLJSON),
        },
    },
    type: GraphQLBoolean,
    resolve: registerExtensionResolver,
}

