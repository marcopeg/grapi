import { GraphQLNonNull, GraphQLObjectType } from 'graphql'
import { GraphQLID, GraphQLBoolean, GraphQLString } from 'graphql'
import { GraphQLDateTime } from 'graphql-iso-date'
import GraphQLJSON from 'graphql-type-json'

import { validateSession } from '../../session.lib'
import updateSessionMutation from './session/update.mutation'
import destroySessionMutation from './session/destroy.mutation'

export default async ({ name, description, fields }) => ({
    description,
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
        name,
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
            update: await updateSessionMutation(),
            destroy: await destroySessionMutation(),
            ...fields,
        },
    }),
    resolve: (params, args, { req, res }) => validateSession(args, req, res),
})