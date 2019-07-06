import uuid from 'uuid'

export const addDeviceId = ({
    attributeName,
    cookieName,
    cookieMaxAge,
    setHeader,
    headerName,
    useClientCookie,
    uuidVersion,
    buffer,
    offset,
    ...config
}) => (req, res, next) => {
    const getCookie = useClientCookie ? req.getClientCookie : req.getCookie
    const setCookie = useClientCookie ? res.setClientCookie : res.setCookie

    if (!getCookie || !setCookie) {
        // eslint-disable-next-line
        throw new Error('[express-device-id] please install "service-express-cookies" before "service-express-device-id"')
    }

    // Get the deviceId from the cookie, or generate a new one
    req[attributeName] = getCookie(cookieName) || uuid[uuidVersion](config, buffer, offset)

    // Set header and cookie value
    setCookie(cookieName, req[attributeName], { maxAge: cookieMaxAge })
    setHeader && res.set(headerName, req[attributeName])

    next()
}
