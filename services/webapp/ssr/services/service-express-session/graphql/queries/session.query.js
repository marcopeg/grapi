import { GraphQLObjectType, GraphQLNonNull } from 'graphql'
import { GraphQLID, GraphQLString } from 'graphql'

// @TODO: let extensions enrich the selection of fields
export const sessionQuery = ({ attributeName }, ctx) => ({
    description: 'Provides the current session id',
    type: new GraphQLNonNull(new GraphQLObjectType({
        name: 'SessionQuery',
        fields: {
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
