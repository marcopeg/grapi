import { GraphQLObjectType, GraphQLNonNull } from 'graphql'

export const sessionMutation = ({
    attributeName,
    mutationName,
    mutationDesc,
    mutations = {},
}, ctx) => ({
    description: mutationDesc,
    type: new GraphQLNonNull(new GraphQLObjectType({
        name: mutationName,
        fields: mutations,
    })),
    resolve: (_, args, { req }) => req[attributeName],
})
