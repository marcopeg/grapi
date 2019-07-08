import { Sequelize } from 'sequelize'
import { getModel } from '@forrestjs/service-postgres'
import { createSession, destroySession } from '../feature-session'

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

export const update = async (args, req, res) => {
    const { find, uname, passw, status, payload, bumpEtag } = args
    const values = {
        ...(uname ? { uname } : {}),
        ...(passw ? { passw } : {}),
        ...(status ? { status } : {}),
        ...(payload ? { payload } : {}),
        ...(bumpEtag ? { etag: Sequelize.literal('etag + 1') } : {}),
    }

    // @TODO: createHook ???

    const record = await getModel('AuthAccount').updateByRef(find, values)

    // @TODO: createHook ???

    return record.get({ plain: true })
}

export const find = async ({ find }, req, res) => {
    const record = await getModel('AuthAccount').findByRef(find)
    return record ? record.get({ plain: true }) : null
}

export const login = async ({ uname, passw, ...args }, req, res) => {
    const record = await getModel('AuthAccount').findLogin({ uname, passw })
    if (!record) {
        return null
    }

    // Hooks integrations will be able to access the current data model
    req.authAccountModel = record

    const sessionData = {
        id: record.get('id'),
        etag: record.get('etag'),
        lastLogin: record.get('lastLogin'),
    }

    const session = args.createSession
        ? await createSession({
            isPersistent: args.persistSession,
            payload: {
                account: sessionData,
            },
        }, req, res)
        : null

    await getModel('AuthAccount').bumpLastLogin(record.get('id'))

    return {
        record: record.get({ plain: true }),
        session: session,
    }
}

export const findSessionAccount = async (args, req, res) => {
    if (req.auth) {
        return req.auth
    }

    const record = await getModel('AuthAccount').findByRef(req.session.token.data.payload.account.id)
    if (!record) {
        return null
    }

    // Validate session's account ETAG
    if (record.get('etag') !== req.session.token.data.payload.account.etag) {
        await destroySession(args, req, res)
        return null
    }

    req.auth = {
        account: {
            model: record,
            data: {
                ...record.get({ plain: true }),
                lastLogin: req.session.token.data.payload.account.lastLogin,
            },
        },
    }

    return req.auth.account.data
}

export const destroyAllSessions = async ({ find }, req, res) => {
    const account = await getModel('AuthAccount').findByRef(find)
    if (!account) {
        throw new Error(`[AuthAccount] account not found: "${find}"`)
    }

    const sessions = await getModel('SessionToken').endMultipleSessions({
        accountId: account.get('id'),
    })

    return sessions
}
