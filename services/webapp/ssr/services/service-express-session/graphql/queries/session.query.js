import { GraphQLObjectType, GraphQLNonNull } from 'graphql'
import { GraphQLID, GraphQLString } from 'graphql'
import * as hooks from '../../hooks'

export const sessionQuery = ({
    attributeName,
    queryName,
    queryDesc,
    queries = {},
}, ctx) => ({
    description: queryDesc,
    args: {
        token: {
            type: GraphQLString,
        },
    },
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
