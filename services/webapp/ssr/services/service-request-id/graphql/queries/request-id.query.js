import { GraphQLID } from 'graphql'

// `attributeName` default value come from
// https://www.npmjs.com/package/express-request-id
export const requestIdQuery = ({ attributeName = 'id' }) => ({
    description: 'Provides the current request id',
    type: GraphQLID,
    resolve: (_, args, { req }) => req[attributeName],
})
