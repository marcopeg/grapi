import {
    GraphQLNonNull,
    GraphQLList,
    GraphQLString,
} from 'graphql'

import { issue } from './graphql-token.lib'

export default {
    description: 'Generates a new extension token valid for one or more namespaces',
    args: {
        namespaces: {
            type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
        },
    },
    type: new GraphQLNonNull(GraphQLString),
    resolve: (_, args) => issue(args),
}
