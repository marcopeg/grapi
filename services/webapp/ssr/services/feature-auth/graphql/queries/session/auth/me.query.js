import { GraphQLNonNull, GraphQLObjectType } from 'graphql'
import { GraphQLString, GraphQLID, GraphQLInt } from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import { GraphQLDateTime } from 'graphql-iso-date'

export default () => ({
    description: 'Retrieve AuthAccount from a running session ',
    type: new GraphQLObjectType({
        name: 'AuthAccount',
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
            etag: {
                type: new GraphQLNonNull(GraphQLInt),
            },
            payload: {
                type: new GraphQLNonNull(GraphQLJSON),
            },
            lastLogin: {
                type: GraphQLDateTime,
            },
        },
    }),
    resolve: (params, args, { req, res }) => {
        return {
            ...req.auth.account.model.get({ plain: true }),
            lastLogin: req.auth.account.data.lastLogin,
        }
    },
})
