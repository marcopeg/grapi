
export const addSession = (config, ctx) => async (req, res, next) => {
    const { attributeName } = config
    const SessionRecord = ctx.pg.getModel('SessionRecord')

    req[attributeName].validate = async () => {
        // check that an existing running session exists
        if (!req[attributeName].id) {
            throw new Error('[pg-session] Session not started')
        }

        // try to get hold of the current session
        await SessionRecord.upsertSession(req[attributeName].id, req[attributeName].validUntil)
        const session = await SessionRecord.validateSession(req[attributeName].id, req[attributeName].validUntil)

        // generate a new session
        if (!session) {
            await req[attributeName].start()
            await SessionRecord.upsertSession(req[attributeName].id, req[attributeName].validUntil)
            await SessionRecord.validateSession(req[attributeName].id, req[attributeName].validUntil)
        }
    }

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

    next()
}
