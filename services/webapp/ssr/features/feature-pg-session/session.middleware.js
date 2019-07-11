import { getModel } from '@forrestjs/service-postgres'
import { validateSession } from './session.lib'

export const addSession = (config) => async (req, res, next) => {
    const SessionRecord = getModel('SessionRecord')
    const { attributeName, autoValidate } = config

    req[attributeName].validate = () => validateSession(req[attributeName])

    req[attributeName].read = (key) => {
        if (!req[attributeName].id) {
            throw new Error('[feature-session] Session not started')
        }

        return SessionRecord.getValue(req[attributeName].id, key)
    }

    req[attributeName].write = async (key, val) => {
        if (!req[attributeName].id) {
            throw new Error('[feature-session] Session not started')
        }

        await SessionRecord.setValue(req[attributeName].id, key, val)
    }

    autoValidate && await req[attributeName].validate()
    next()
}
