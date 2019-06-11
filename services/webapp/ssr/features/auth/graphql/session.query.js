import {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLID,
} from 'graphql'

import { GraphQLDateTime } from 'graphql-iso-date'

import { createHook } from '@forrestjs/hooks'
import { getSession } from '../lib/session'
import { AUTH_SESSION_QUERY } from '../hooks'

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
    }

    await createHook(AUTH_SESSION_QUERY, {
        async: 'serie',
        args: { fields },
    })

    return {
        description: 'Wraps session dependent queries',
        type: new GraphQLObjectType({
            name: 'AuthSession',
            fields,
        }),
        resolve: (params, args, { req, res }) =>
            getSession(req, res),
    }
}
