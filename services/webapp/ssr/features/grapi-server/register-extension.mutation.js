import { GraphQLBoolean, GraphQLNonNull } from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import { register } from './extensions-registry'

export default {
    description: 'Register or updates an extension',
    args: {
        definition: {
            type: new GraphQLNonNull(GraphQLJSON),
        },
    },
    type: GraphQLBoolean,
    resolve: async (_, args) => register(args.definition),
}

