import { GraphQLObjectType } from 'graphql'

export const authQuery = async (queries = {}, config, ctx) => ({
    description: 'Wraps Auth dependent queries',
    type: new GraphQLObjectType({
        name: 'AuthQuery',
        fields: queries,
    }),
    resolve: (_, args, { req, res }) => req.auth.validate(),
})
