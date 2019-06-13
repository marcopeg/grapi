import { getModel } from '@forrestjs/service-postgres'
import jwtService from '@forrestjs/service-jwt'
import uuid from 'uuid/v4'

const COOKIE_NAME = 'session'

const getBearerToken = req => {
    try {
        const authHeader = req.headers['authorization'] || req.headers['Authorization']
        return authHeader.substr(7)
    } catch (err) {
        return null
    }
}

export const createSession = async (args, req, res) => {
    const { expiresIn, payload, isPersistent, isActive } = args
    const jwtData = { ...payload, id: uuid() }
    const jwtOptions = { expiresIn }

    // @TODO: hook to extend `jwtData` and `jwtOptions`

    const token = await jwtService.sign(jwtData, jwtOptions)
    const tokenData = await jwtService.verify(token)

    const record = await getModel('SessionToken').create({
        id: tokenData.payload.id,
        validUntil: new Date(tokenData.exp * 1000),
        lastExtended: new Date(),
        lastPing: new Date(),
        isActive,
        payload,
    })

    if (isPersistent) {
        res.setAppCookie(COOKIE_NAME, token)
    }

    return {
        ...record.get({ plain: true }),
        token,
    }
}

export const validateSession = async (args, req, res) => {
    // handle multiple calls
    if (req.session) {
        return req.session
    }

    const { token: receivedToken, validate } = args

    // get token from multiple sources
    // - argument
    // - Authentication Bearer
    // - Cookie
    const token = receivedToken || getBearerToken(req) || req.getAppCookie(COOKIE_NAME)
    const tokenData = await jwtService.verify(token)
    const { id, ...payload } = tokenData.payload

    if (validate) {
        const record = await getModel('SessionToken').validateSession(id)
        if (!record) {
            res.deleteAppCookie(COOKIE_NAME, token)
            req.session = null
            return req.session
        }
    }

    req.session = {
        id,
        payload,
        createdAt: new Date(tokenData.iat * 1000),
        validUntil: new Date(tokenData.exp * 1000),
    }

    return req.session
}

export const destroySession = async () => {
    // res.deleteAppCookie(COOKIE_NAME, token)
}
