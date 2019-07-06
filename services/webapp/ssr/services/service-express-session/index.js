import * as hooks from './hooks'
import { addSession } from './add-session.middleware'
// import { deviceIdQuery } from './graphql/queries/device-id.query'

const buildConfig = ({ getConfig }) => ({
    ...getConfig('express.session', {}),
    duration: getConfig('express.session.duration', '20m'),
    attributeName: getConfig('express.session.attributeName', 'session'),
    autoStart: getConfig('express.session.autoStart', true),
    autoExtend: getConfig('express.session.autoExtend', true),
    uuidVersion: getConfig('express.session.uuidVersion', 'v4'),
    setHeader: getConfig('express.session.setHeader', true),
    headerName: getConfig('express.session.headerName', 'X-Session-Id'),
    useCookies: getConfig('express.session.useCookies', true),
    useClientCookie: getConfig('express.session.useClientCookie', false),
    cookieName: getConfig('express.session.cookieName', 'session-id'),
})

export default ({ registerAction, registerHook, ...ctx }) => {
    registerHook(hooks)

    registerAction({
        hook: '$EXPRESS_MIDDLEWARE',
        name: hooks.SERVICE_NAME,
        trace: __filename,
        handler: ({ registerMiddleware }, ctx) => {
            const config = buildConfig(ctx)
            registerMiddleware(addSession(config, ctx))
        },
    })

    // // Express GraphQL is an optional hook as the service may not be registered
    // registerAction({
    //     hook: '$EXPRESS_GRAPHQL',
    //     name: hooks.SERVICE_NAME,
    //     optional: true,
    //     trace: __filename,
    //     handler: ({ registerQuery }, ctx) => {
    //         const config = buildConfig(ctx)
    //         registerQuery('deviceId', deviceIdQuery(config))
    //     },
    // })
}
