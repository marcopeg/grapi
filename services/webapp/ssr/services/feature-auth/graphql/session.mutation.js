import {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLID,
    GraphQLBoolean,
} from 'graphql'

import { GraphQLDateTime } from 'graphql-iso-date'

import { createHook } from '@forrestjs/hooks'
import { getSession } from '../lib/session'
import { logout } from '../lib/login'
import { AUTH_SESSION_MUTATION } from '../hooks'

export default async () => {
    const fields = {
        id: {
            type: new GraphQLNonNull(GraphQLID),
        },
        created: {
            type: new GraphQLNonNull(GraphQLDateTime),
        },
        expiry: {
            type: new GraphQLNonNull(GraphQLDateTime),
        },
        logout: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: (params, args, { req, res }) =>
                logout(req, res),
        },
    }

    await createHook(AUTH_SESSION_MUTATION, {
        async: 'serie',
        args: { fields },
    })

    return {
        description: 'Wraps session dependent mutations',
        type: new GraphQLObjectType({
            name: 'AuthSessionMutation',
            fields,
        }),
        resolve: (params, args, { req, res }) =>
            getSession(req, res),
    }
}
