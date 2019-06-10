import expressGraphql from 'express-graphql'
import { INIT_FEATURES } from '@forrestjs/hooks'
import { EXPRESS_ROUTE } from '@forrestjs/service-express'
import { FEATURE_NAME } from './hooks'
import { createSchema } from './schema'
import { init as initExtensions } from './extensions'

// need to run "createSchema()" per request so it is possible
// to mutate it dynamically
const makeGrapiMiddleware = () => (req, res, next) =>
    expressGraphql({
        graphiql: true,
        schema: createSchema(),
    })(req, res, next)

export const register = ({ registerAction }) => {
    registerAction({
        hook: INIT_FEATURES,
        name: FEATURE_NAME,
        trace: __filename,
        handler: initExtensions,
    })
    registerAction({
        hook: EXPRESS_ROUTE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: ({ app }) => app.use('/api', makeGrapiMiddleware()),
    })
}
