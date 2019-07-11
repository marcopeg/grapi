import { GraphQLObjectType, GraphQLString } from 'graphql'
import { getModel } from '@forrestjs/service-postgres'

export const authQuery = async (queries = {}) => ({
    description: 'Wraps Auth dependent queries',
    type: new GraphQLObjectType({
        name: 'AuthQuery',
        fields: {
            // ...queries,
            foo: {
                type: GraphQLString,
                resolve: (data) => data.uname,
            },
        },
    }),
    resolve: async (_, args, { req, res }) => {
        const data = await req.session.read()
        return await getModel('AuthAccount').findOne({
            where: {
                id: data.auth_id,
                etag: data.auth_etag,
            },
            raw: true,
        })
    },
})
