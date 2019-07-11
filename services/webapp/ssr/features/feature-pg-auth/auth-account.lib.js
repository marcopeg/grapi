// import { Sequelize } from 'sequelize'
import { getModel } from '@forrestjs/service-postgres'
// import { createSession, destroySession } from '../feature-session'

export const create = async ({ uname, passw, status = 0, payload = {} }, req, res) => {
    const record = await getModel('AuthAccount').register({
        uname,
        passw,
        status,
        payload,
    })

    // @TODO: createHook ???

    return record.get({ plain: true })
}

export const login = async ({ uname, passw }, req, res) => {
    const record = await getModel('AuthAccount').findLogin({ uname, passw })
    if (!record) {
        throw new Error('Login failed')
    }

    // Initialize a new session if doesn't exits and connect it with the
    // authenticated account.
    await req.session.validate()

    // Decorate the session JWT with the identity informations.
    const auth = { auth_id: record.id, auth_etag: record.etag }
    await req.session.set(auth)
    await req.session.write(auth)

    await getModel('AuthAccount').bumpLastLogin(record.id)
    return record.get({ plain: true })
}
