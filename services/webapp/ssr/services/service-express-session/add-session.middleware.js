import uuid from 'uuid'

// Generate a new session payload with an ID.
const createSessionId = async ({
    uuidVersion,
    buffer,
    offset,
    ...config
}, ctx, res) => uuid[uuidVersion](config, buffer, offset)

const initSession = async (config, ctx, req, res) => ({
    id: null,
    jwt: null,
    validUntil: null,
})

const flushSession = async ({
    duration,
    attributeName,
    setHeader,
    headerName,
    useCookies,
    useClientCookie,
    cookieName,
}, ctx, req, res) => {
    const setCookie = useClientCookie ? res.setClientCookie : res.setCookie
    const token = await ctx.jwt.sign(req[attributeName].id, { expiresIn: duration })
    setHeader && res.set(headerName, token)
    useCookies && setCookie(cookieName, token, { maxAge: duration })
    return token
}

const getJwtExpiryDate = async (token, ctx) => {
    const data = await ctx.jwt.verify(token)
    return new Date(data.exp * 1000)
}

export const addSession = (config, ctx) => async (req, res, next) => {
    const {
        autoStart,
        autoExtend,
        attributeName,
        headerName,
        useCookies,
        useClientCookie,
        cookieName,
    } = config

    // Get a reference to the cookies helper
    const getCookie = useClientCookie ? req.getClientCookie : req.getCookie
    const deleteCookie = useClientCookie ? res.deleteClientCookie : res.deleteCookie

    if (useCookies && (!getCookie || !deleteCookie)) {
        throw new Error('[express-session] please install "service-express-cookies" before "service-express-session"')
    }

    // initialize the request namespace
    req[attributeName] = await initSession(config, ctx, req, res)

    // Get existing session from request informations
    // (handle auto extension of the headers)
    try {
        const receivedJWT = req.headers[headerName] || (useCookies && getCookie(cookieName))
        const receivedData = receivedJWT && (await ctx.jwt.verify(receivedJWT))
        req[attributeName].id = receivedData.payload
        req[attributeName].jwt = autoExtend
            ? await await flushSession(config, ctx, req, res)
            : receivedJWT
        req[attributeName].validUntil = await getJwtExpiryDate(req[attributeName].jwt, ctx)
    } catch (err) {} // eslint-disable-line

    // generate a new session
    if (!req[attributeName].id && autoStart) {
        req[attributeName].id = await createSessionId(config, ctx, res)
        req[attributeName].jwt = await flushSession(config, ctx, req, res)
        req[attributeName].validUntil = await getJwtExpiryDate(req[attributeName].jwt, ctx)
    }

    // decorate the Express app with references to the session id
    // req[attributeName] = { id: req[attributeName].id }
    res[attributeName] = {
        start: async () => {
            req[attributeName].id = await createSessionId(config, ctx, res)
            req[attributeName].jwt = await flushSession(config, ctx, req, res)
            req[attributeName].validUntil = await getJwtExpiryDate(req[attributeName].jwt, ctx)
            return req[attributeName]
        },
        destroy: async () => {
            req[attributeName] = await initSession(config, ctx, req, res)
            deleteCookie(cookieName)
        },
    }

    next()
}
