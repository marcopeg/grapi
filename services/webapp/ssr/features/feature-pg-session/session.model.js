import Sequelize from 'sequelize'
import * as hooks from './hooks'

export const name = 'SessionRecord'

const fields = {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    payload: {
        type: Sequelize.JSONB,
        defaultValue: {},
    },
    hits: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
    },
    validUntil: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    endedAt: {
        type: Sequelize.DATE,
    },
}

const options = {
    tableName: 'session_records',
    freezeTableName: true,
    underscored: true,
}

const upsertSession = (conn, Model) => async (id, validUntil) => {
    const res = await Model.findOrCreate({
        where: { id },
        defaults: { id, validUntil },
    })
    return res[0]
}

const validateSession = (conn, Model) => async (id, validUntil) => {
    const results = await Model.update({
        validUntil,
        hits: Sequelize.literal('hits + 1'),
    }, {
        where: {
            id,
            isActive: true,
            endedAt: null,
            validUntil: { [Sequelize.Op.gte]: Sequelize.literal('NOW()') },
        },
        returning: true,
        raw: true,
    })

    const record = results[1].shift()
    return record
}

// const updateSession = (conn, Model) => async (id, { payload, validUntil }) => {
//     const results = await Model.update({
//         payload,
//         validUntil,
//         lastPing: Sequelize.literal('NOW()'),
//         hits: Sequelize.literal('hits + 1'),
//     }, {
//         where: {
//             id,
//             isActive: true,
//             validUntil: { [Sequelize.Op.gte]: Sequelize.literal('NOW()') },
//             endedAt: null,
//         },
//         returning: true,
//         raw: true,
//     })

//     const record = results[1].shift()
//     return record
// }


// const endSession = (conn, Model) => async (id) => {
//     const results = await Model.update({
//         isActive: false,
//         endedAt: Sequelize.literal('NOW()'),
//     }, {
//         where: { id, isActive: true },
//         returning: true,
//         raw: true,
//     })

//     const record = results[1].shift()
//     return record
// }

// const endMultipleSessions = (conn, Model) => async (where) => {
//     const results = await Model.update({
//         isActive: false,
//         endedAt: Sequelize.literal('NOW()'),
//     }, {
//         where: {
//             [Sequelize.Op.and]: [
//                 { isActive: true },
//                 where,
//             ],
//         },
//         returning: true,
//         raw: true,
//     })

//     return results[1]
// }

// setValue('key', 'value)
// setValue({ key1: 123, key2: 'aaa' })
const setValue = (conn, Model) => (id, key, val) => {
    const data = (typeof key === 'object')
        ? key
        : { [key]: val }

    return Model.update({
        payload: Sequelize.literal(`payload || '${JSON.stringify(data)}'`),
    }, {
        where: { id },
    })
}

// getValue(id, null) -> full payload
// getValue(id, key) -> single key
const getValue = (conn, Model) => async (id, key = null) => {
    try {
        const res = await Model.findOne({
            where: { id },
            attributes: (
                key
                    ? [[ Sequelize.json(`payload.${key}`), 'value' ]]
                    : [[ 'payload', 'value' ]]
            ),
            raw: true,
        })
        return res.value
    } catch (err) {
        return undefined
    }
}

export const init = async (conn, { createHook }) => {
    await createHook.serie(hooks.SESSION_INIT_MODEL, { name, fields, options, conn })

    const Model = conn.define(name, fields, options)
    Model.upsertSession = upsertSession(conn, Model)
    Model.validateSession = validateSession(conn, Model)
    Model.setValue = setValue(conn, Model)
    Model.getValue = getValue(conn, Model)
    // Model.updateSession = updateSession(conn, Model)
    // Model.endSession = endSession(conn, Model)
    // Model.endMultipleSessions = endMultipleSessions(conn, Model)

    await createHook.serie(hooks.SESSION_DECORATE_MODEL, { name, fields, options, Model, conn })

    return Model.sync()
}
