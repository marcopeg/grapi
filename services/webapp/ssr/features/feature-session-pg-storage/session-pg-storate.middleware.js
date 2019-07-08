
export const addSessionPgStorage = (config, ctx) => async (req, res, next) => {
    if (!req.session.id) {
        next()
        return
    }

    const Session = ctx.pg.getModel('Session')

    req.session.validate = async () => {
        // try to get hold of the current session
        await Session.upsertSession(req.session.id, req.session.validUntil)
        const session = await Session.validateSession(req.session.id, req.session.validUntil)

        // generate a new session
        if (!session) {
            await res.session.start()
            await Session.upsertSession(req.session.id, req.session.validUntil)
            await Session.validateSession(req.session.id, req.session.validUntil)
        }
    }

    next()
}
