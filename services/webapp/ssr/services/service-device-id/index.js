import * as hooks from './hooks'
import { addDeviceId } from './add-device-id.middleware'
import { deviceIdQuery } from './graphql/queries/device-id.query'

const buildConfig = ({ getConfig }) => ({
    ...getConfig('express.deviceId', {}),
    setHeader: getConfig('express.deviceId.setHeader', true),
    headerName: getConfig('express.deviceId.headerName', 'X-Device-Id'),
    uuidVersion: getConfig('express.deviceId.uuidVersion', 'v4'),
    attributeName: getConfig('express.deviceId.attributeName', 'deviceId'),
    // @TODO: Implement "useCookies", the deviceId should also be passed as header for cookie-less implementations
    useCookies: getConfig('express.deviceId.useClientCookie', true),
    useClientCookie: getConfig('express.deviceId.useClientCookie', false),
    cookieName: getConfig('express.deviceId.cookieName', 'deviceId'),
    cookieMaxAge: getConfig('express.deviceId.cookieMaxAge', '300y'),
})

export default ({ registerAction, registerHook, ...ctx }) => {
    registerHook(hooks)

    registerAction({
        hook: '$EXPRESS_MIDDLEWARE',
        name: hooks.SERVICE_NAME,
        trace: __filename,
        handler: ({ registerMiddleware }, ctx) => {
            const config = buildConfig(ctx)
            registerMiddleware(addDeviceId(config))
        },
    })

    // Express GraphQL is an optional hook as the service may not be registered
    registerAction({
        hook: '$EXPRESS_GRAPHQL',
        name: hooks.SERVICE_NAME,
        optional: true,
        trace: __filename,
        handler: ({ registerQuery }, ctx) => {
            const config = buildConfig(ctx)
            registerQuery('deviceId', deviceIdQuery(config))
        },
    })
}
