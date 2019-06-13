import { GraphQLBoolean, GraphQLString } from 'graphql'
import GraphQLJSON from 'graphql-type-json'

import { createSession } from './session.lib'

export default async () => ({
    description: 'Creates a new Session',
    args: {
        expiresIn: {
            type: GraphQLString,
            defaultValue: '20m',
        },
        isActive: {
            type: GraphQLBoolean,
            defaultValue: true,
        },
        isPersistent: {
            type: GraphQLBoolean,
            defaultValue: true,
        },
        payload: {
            type: GraphQLJSON,
            defaultValue: {},
        },
    },
    type: GraphQLJSON,
    resolve: (params, args, { req, res }) => createSession(args, req, res),
})
