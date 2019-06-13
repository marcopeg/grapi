import { GraphQLNonNull, GraphQLObjectType } from 'graphql'
import { GraphQLID, GraphQLBoolean, GraphQLString, GraphQLInt } from 'graphql'
import { GraphQLDateTime } from 'graphql-iso-date'
import { getSession } from '../lib/session'
import { logout } from '../lib/login'

export default async mutations => ({
    description: 'Wraps session dependent mutations',
    args: {
        token: {
            type: GraphQLString,
        },
    },
    type: new GraphQLObjectType({
        name: 'AuthSessionMutation',
        fields: {
            ...mutations,
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
            logout: {
                type: new GraphQLNonNull(GraphQLBoolean),
                resolve: (params, args, { req, res }) => logout(req, res),
            },
        },
    }),
    resolve: (params, args, { req, res }) => getSession({ ...args, req, res }),
})
