
export const addSession = (config, ctx) => async (req, res, next) => {
    if (!req.session.id) {
        next()
        return
    }

    const SessionRecord = ctx.pg.getModel('SessionRecord')

    req.session.validate = async () => {
        // try to get hold of the current session
        await SessionRecord.upsertSession(req.session.id, req.session.validUntil)
        const session = await SessionRecord.validateSession(req.session.id, req.session.validUntil)

        // generate a new session
        if (!session) {
            await res.session.start()
            await SessionRecord.upsertSession(req.session.id, req.session.validUntil)
            await SessionRecord.validateSession(req.session.id, req.session.validUntil)
        }
    }

    req.session.retrieve = (key) => {
        if (!req.session.id) {
            throw new Error('[feature-session] Session not started')
        }

        return SessionRecord.getValue(req.session.id, key)
    }

    req.session.store = async (key, val) => {
        if (!req.session.id) {
            throw new Error('[feature-session] Session not started')
        }

        await SessionRecord.setValue(req.session.id, key, val)
    }

    next()
}
