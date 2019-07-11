import { POSTGRES_BEFORE_START } from '@forrestjs/service-postgres/lib/hooks'
import * as hooks from './hooks'
import * as sessionModel from './session.model'
import { addSession } from './session.middleware'

export default ({ registerHook, registerAction }) => {
    registerHook(hooks)

    // Add Data Model
    registerAction({
        hook: `${POSTGRES_BEFORE_START}/default`,
        name: hooks.FEATURE_NAME,
        handler: ({ registerModel }) => {
            registerModel(sessionModel)
        },
    })

    registerAction({
        hook: '$EXPRESS_MIDDLEWARE',
        name: hooks.FEATURE_NAME,
        trace: __filename,
        handler: ({ registerMiddleware }, ctx) => {
            registerMiddleware(addSession({}, ctx))
        },
    })
}
