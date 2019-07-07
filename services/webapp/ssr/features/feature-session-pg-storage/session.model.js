import Sequelize from 'sequelize'
import * as hooks from './hooks'

export const name = 'Session'

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
    // payload: {
    //     type: Sequelize.JSONB,
    //     defaultValue: {},
    // },
    hits: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
    },
    validUntil: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    // lastPing: {
    //     type: Sequelize.DATE,
    //     allowNull: false,
    // },
    endedAt: {
        type: Sequelize.DATE,
    },
}

const options = {
    tableName: 'sessions',
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

export const init = async (conn, { createHook }) => {
    await createHook.serie(hooks.SESSION_PG_STORAGE_INIT_MODEL, { name, fields, options })

    const Model = conn.define(name, fields, options)
    Model.upsertSession = upsertSession(conn, Model)
    Model.validateSession = validateSession(conn, Model)
    // Model.updateSession = updateSession(conn, Model)
    // Model.endSession = endSession(conn, Model)
    // Model.endMultipleSessions = endMultipleSessions(conn, Model)

    await createHook.serie(hooks.SESSION_PG_STORAGE_DECORATE_MODEL, { name, fields, options, Model })

    return Model.sync()
}
