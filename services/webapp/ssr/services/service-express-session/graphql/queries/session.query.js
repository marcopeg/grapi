import { GraphQLObjectType, GraphQLNonNull } from 'graphql'
import { GraphQLID, GraphQLString } from 'graphql'

export const sessionQuery = ({
    attributeName,
    queryName,
    queryDesc,
    queries = {},
}, ctx) => ({
    description: queryDesc,
    type: new GraphQLNonNull(new GraphQLObjectType({
        name: queryName,
        fields: {
            ...queries,
            id: {
                type: GraphQLID,
            },
            jwt: {
                type: GraphQLString,
            },
        },
    })),
    resolve: (_, args, { req }) => req[attributeName],
})
