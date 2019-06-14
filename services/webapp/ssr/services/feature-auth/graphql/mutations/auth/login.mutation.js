import { GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLBoolean } from 'graphql'
import { GraphQLString, GraphQLID } from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import { GraphQLDateTime } from 'graphql-iso-date'
import { login } from '../../../auth-account.lib'

export default () => ({
    description: 'Creates a brand new Auth account',
    args: {
        uname: {
            type: new GraphQLNonNull(GraphQLString),
        },
        passw: {
            type: new GraphQLNonNull(GraphQLString),
        },
        createSession: {
            type: GraphQLBoolean,
            defaultValue: true,
        },
        persistSession: {
            type: GraphQLBoolean,
            defaultValue: true,
        },
    },
    type: new GraphQLObjectType({
        name: 'AuthAccountLogin',
        fields: {
            id: {
                type: new GraphQLNonNull(GraphQLID),
            },
            uname: {
                type: new GraphQLNonNull(GraphQLString),
            },
            status: {
                type: new GraphQLNonNull(GraphQLInt),
            },
            payload: {
                type: GraphQLJSON,
            },
            lastLogin: {
                type: GraphQLDateTime,
            },
            sessionId: {
                type: GraphQLID,
            },
            sessionToken: {
                type: GraphQLString,
            },
        },
    }),
    resolve: async (params, args, { req, res }) => {
        const data = await login(args, req, res)
        if (!data) {
            return null
        }

        console.log(data)

        return {
            ...data.record,
            ...(data.session ? {
                sessionId: data.session.id,
                sessionToken: data.session.token,
            } : null),
        }
    },
})
