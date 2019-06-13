import { GraphQLNonNull, GraphQLObjectType } from 'graphql'
import { GraphQLID, GraphQLInt, GraphQLString } from 'graphql'
import { GraphQLDateTime } from 'graphql-iso-date'
import { getSession } from '../lib/session'

export default async queries => ({
    description: 'Wraps session dependent queries',
    args: {
        token: {
            type: GraphQLString,
        },
    },
    type: new GraphQLObjectType({
        name: 'AuthSession',
        fields: {
            ...queries,
            id: {
                type: new GraphQLNonNull(GraphQLID),
            },
            status: {
                type: new GraphQLNonNull(GraphQLInt),
            },
            created: {
                type: new GraphQLNonNull(GraphQLDateTime),
            },
            expiry: {
                type: new GraphQLNonNull(GraphQLDateTime),
            },
        },
    }),
    resolve: (params, args, { req, res }) => getSession({ ...args, req, res }),
})
