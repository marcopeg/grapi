import { GraphQLNonNull, GraphQLObjectType } from 'graphql'
import { GraphQLBoolean, GraphQLID, GraphQLString } from 'graphql'
import { GraphQLDateTime } from 'graphql-iso-date'
import GraphQLJSON from 'graphql-type-json'
import { updateSession } from '../../../session.lib'

export default async () => ({
    description: 'Updates a running session',
    args: {
        payload: {
            type: new GraphQLNonNull(GraphQLJSON),
            defaultValue: {},
        },
        isPersistent: {
            type: GraphQLBoolean,
            defaultValue: true,
        },
    },
    type: new GraphQLNonNull(new GraphQLObjectType({
        name: 'SessionUpdate',
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
            token: {
                type: new GraphQLNonNull(GraphQLString),
            },
        },
    })),
    resolve: (params, args, { req, res }) => updateSession(args, req, res),
})
