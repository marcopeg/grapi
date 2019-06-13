import {
    GraphQLNonNull,
    GraphQLString,
} from 'graphql'

// import { issue } from './graphql-token.lib'

export default {
    description: 'Reserves a new namespace tied to the session user',
    args: {
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
    type: new GraphQLNonNull(GraphQLString),
    resolve: (_, args) => {
        return 'foo'
    },
}
