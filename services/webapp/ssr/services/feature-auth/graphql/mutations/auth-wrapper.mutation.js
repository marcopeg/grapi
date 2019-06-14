import { GraphQLObjectType } from 'graphql'

import loginMutation from './auth/login.mutation'

export default async (mutations = {}) => ({
    description: 'Wraps Auth dependent mutations',
    type: new GraphQLObjectType({
        name: 'AuthMutation',
        fields: {
            login: await loginMutation(),
            ...mutations,
        },
    }),
    resolve: () => ({}),
})
