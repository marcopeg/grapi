import { getModel } from '@forrestjs/service-postgres'
import jwtService from '@forrestjs/service-jwt'
import { createHook } from '@forrestjs/hooks'
import { AUTH_AFTER_LOGIN, AUTH_BEFORE_LOGOUT } from '../hooks'

const COOKIE_NAME = 'auth::login'

export const login = async (req, res, uname, passw) => {
    const AuthAccount = getModel('AuthAccount')

    const account = await AuthAccount.findLogin(uname, passw)
    if (!account) throw new Error('user not found or wrong password')

    const payload = { id: account.id, status: account.status, etag: account.etag }
    const token = await jwtService.sign(payload)
    const tokenData = await jwtService.verify(token)

    res.setAppCookie(COOKIE_NAME, token)

    await AuthAccount.bumpLastLogin(account.id)

    const info = {
        id: account.id,
        status: account.status,
        expiry: new Date(tokenData.exp * 1000),
        lastLogin: account.lastLogin
            ? account.lastLogin.toISOString()
            : null,
        token,
    }

    await createHook(AUTH_AFTER_LOGIN, {
        async: 'serie',
        ctx: req.hooks.ctx,
        args: { ...info, req, res },
        logTrace: console.log,
    })

    return info
}

export const logout = async (req, res) => {
    await createHook(AUTH_BEFORE_LOGOUT, {
        async: 'serie',
        ctx: req.hooks.ctx,
        args: { req, res },
    })

    res.deleteAppCookie(COOKIE_NAME)
    return true
}
