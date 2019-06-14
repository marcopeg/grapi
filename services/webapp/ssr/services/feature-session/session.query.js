import { GraphQLNonNull, GraphQLObjectType } from 'graphql'
import { GraphQLID, GraphQLBoolean, GraphQLString } from 'graphql'
import { GraphQLDateTime } from 'graphql-iso-date'
import GraphQLJSON from 'graphql-type-json'

import { validateSession } from './session.lib'

export default async (queries = {}) => ({
    description: 'Wraps session dependent queries',
    args: {
        token: {
            type: GraphQLString,
        },
        validate: {
            type: GraphQLBoolean,
            defaultValue: true,
        },
    },
    type: new GraphQLObjectType({
        name: 'SessionQuery',
        fields: {
            id: {
                type: new GraphQLNonNull(GraphQLID),
            },
            createdAt: {
                type: new GraphQLNonNull(GraphQLDateTime),
            },
            validUntil: {
                type: new GraphQLNonNull(GraphQLDateTime),
            },
            payload: {
                type: new GraphQLNonNull(GraphQLJSON),
            },
            ...queries,
        },
    }),
    resolve: (params, args, { req, res }) => validateSession(args, req, res),
})
