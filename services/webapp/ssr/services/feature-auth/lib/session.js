import { getModel } from '@forrestjs/service-postgres'
import jwtService from '@forrestjs/service-jwt'

const COOKIE_NAME = 'auth::login'

const getBearerToken = req => {
    try {
        const authHeader = req.headers['authorization'] || req.headers['Authorization']
        return authHeader.substr(7)
    } catch (err) {
        return null
    }
}

export const getSession = async ({ req, res, token: receivedToken }) => {
    try {
        // handle multiple calls
        if (req.session) {
            return req.session
        }

        // get token from multiple sources
        // - argument
        // - Authentication Bearer
        // - Cookie
        const token = receivedToken || getBearerToken(req) || req.getAppCookie(COOKIE_NAME)
        const data = await jwtService.verify(token)

        req.session = {
            id: data.payload.id,
            status: data.payload.status,
            created: new Date(data.iat * 1000),
            expiry: new Date(data.exp * 1000),
        }

        return req.session
    } catch (err) {
        return null
    }
}

export const validateSession = async ({ req, res, token: receivedToken }) => {
    try {
        const token = receivedToken || getBearerToken(req) || req.getAppCookie(COOKIE_NAME)
        const data = await jwtService.verify(token)

        const { id, etag } = data.payload
        await getModel('AuthAccount').validateSession(id, etag)

        const newToken = await jwtService.sign(data.payload)
        const newData = await jwtService.verify(newToken)
        res.setAppCookie(COOKIE_NAME, newToken)

        req.session = {
            id: newData.payload.id,
            status: newData.payload.status,
            created: new Date(newData.iat * 1000),
            expiry: new Date(newData.exp * 1000),
            token: newToken,
        }

        return req.session
    } catch (err) {
        res.deleteAppCookie(COOKIE_NAME)
        return null
    }
}

export const getSessionMiddleware = () => async (req, res, next) => {
    await getSession(req, res)
    next()
}
