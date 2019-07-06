import { GraphQLID } from 'graphql'

export const deviceIdQuery = ({ attributeName }) => ({
    description: 'Provides the current device id',
    type: GraphQLID,
    resolve: (_, args, { req }) => req[attributeName],
})
