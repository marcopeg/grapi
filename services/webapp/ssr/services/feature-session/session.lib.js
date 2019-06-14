import { createHook } from '@forrestjs/hooks'
import { getModel } from '@forrestjs/service-postgres'
import jwtService from '@forrestjs/service-jwt'
import uuid from 'uuid/v4'

import { SESSION_DECORATE_TOKEN, SESSION_DECORATE_RECORD } from './hooks'

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

    await createHook(SESSION_DECORATE_TOKEN, {
        async: 'serie',
        args: {
            data: jwtData,
            optiosn: jwtOptions,
            args,
            req,
            res,
        },
    })

    // Generate token and record data
    const token = await jwtService.sign(jwtData, jwtOptions)
    const tokenData = await jwtService.verify(token)
    const recordFields = {
        id: tokenData.payload.id,
        validUntil: new Date(tokenData.exp * 1000),
        lastExtended: new Date(),
        lastPing: new Date(),
        isActive,
        payload,
    }

    await createHook(SESSION_DECORATE_RECORD, {
        async: 'serie',
        args: {
            fields: recordFields,
            args,
            req,
            res,
        },
    })

    const record = await getModel('SessionToken').create(recordFields)

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

    let record = null
    if (validate) {
        record = await getModel('SessionToken').validateSession(id)
        if (!record) {
            res.deleteAppCookie(COOKIE_NAME, token)
            req.session = null
            return req.session
        }
    }

    req.session = {
        token: {
            model: record,
            data: {
                id,
                payload,
                createdAt: new Date(tokenData.iat * 1000),
                validUntil: new Date(tokenData.exp * 1000),
            },
        },
    }

    return req.session
}

export const updateSession = async (args, req, res) => {
    const { payload, isPersistent } = args
    const jwtData = { ...payload, id: req.session.token.data.id }
    const jwtOptions = {}

    // @TODO: hook to extend `jwtData` and `jwtOptions`
    const token = await jwtService.sign(jwtData, jwtOptions)
    const tokenData = await jwtService.verify(token)

    const record = await getModel('SessionToken').updateSession(req.session.token.data.id, {
        payload,
        validUntil: new Date(tokenData.exp * 1000),
    })

    // Force to destroy the client cookie in case the persisted session is not valid
    if (!record) {
        res.deleteAppCookie(COOKIE_NAME, token)
        req.session = null
        throw new Error('Bad session')
    }

    // Refresh the client cookie with the new token
    if (isPersistent) {
        res.setAppCookie(COOKIE_NAME, token)
    }

    return {
        ...record,
        token,
    }
}

export const destroySession = async (args, req, res) => {
    await getModel('SessionToken').endSession(req.session.token.data.id)
    res.deleteAppCookie(COOKIE_NAME)
    return true
}
