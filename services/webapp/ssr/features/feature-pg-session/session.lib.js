import { getModel } from '@forrestjs/service-postgres'

export const validateSession = async (session) => {
    const SessionRecord = getModel('SessionRecord')

    // check that an existing running session exists
    if (!session.id) {
        throw new Error('[pg-session] Session not started')
    }

    // try to get hold of the current session
    await SessionRecord.upsertSession(session.id, session.validUntil)
    const record = await SessionRecord.validateSession(session.id, session.validUntil)

    // generate a new session
    if (!record) {
        await session.create()
        await SessionRecord.upsertSession(session.id, session.validUntil)
        await SessionRecord.validateSession(session.id, session.validUntil)
    }
}
