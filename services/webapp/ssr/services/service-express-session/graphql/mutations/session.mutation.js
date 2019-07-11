import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql'
import * as hooks from '../../hooks'

export const sessionMutation = ({
    attributeName,
    mutationName,
    mutationDesc,
    mutations = {},
}, ctx) => ({
    description: mutationDesc,
    args: {
        token: {
            type: GraphQLString,
        },
    },
    type: new GraphQLNonNull(new GraphQLObjectType({
        name: mutationName,
        fields: mutations,
    })),
    resolve: async (_, { token }, { req, res }) => {
        await req[attributeName].start(token)
        await ctx.createHook.serie(hooks.EXPRESS_SESSION_VALIDATE, {
            session: req[attributeName],
            req,
            res,
        })
        return req[attributeName]
    },
})
