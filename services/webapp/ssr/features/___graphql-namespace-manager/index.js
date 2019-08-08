import { POSTGRES_BEFORE_START } from '@forrestjs/service-postgres/lib/hooks'
import { AUTH_SESSION_GRAPHQL } from '../../services/feature-auth/hooks'
import { FEATURE_NAME } from './hooks'

// Sequelize Models
import * as graphqlNamespaceModel from './graphql-namespace.model'

// GraphQL Endpoints
import createNamespaceMutation from './create-namespace.mutation'

export const register = ({ registerAction }) => {
    // register database models
    registerAction({
        hook: `${POSTGRES_BEFORE_START}/default`,
        name: FEATURE_NAME,
        handler: ({ options }) => {
            options.models.push(graphqlNamespaceModel)
        },
    })

    // register GraphQL Endpoints
    registerAction({
        hook: AUTH_SESSION_GRAPHQL,
        name: FEATURE_NAME,
        handler: async ({ mutations }) => {
            mutations.createNamespace = createNamespaceMutation
        },
    })
}
