import Sequelize from 'sequelize'
import { createHook } from '@forrestjs/hooks'
import { CONFIG_SESSION_TOKEN_MODEL, DECORATE_SESSION_TOKEN_MODEL } from './hooks'

export const name = 'SessionToken'

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
    lastPing: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    endedAt: {
        type: Sequelize.DATE,
    },
}

const options = {
    tableName: 'session_tokens',
    freezeTableName: true,
    underscored: true,
}

const validateSession = (conn, Model) => async (id) => {
    const results = await Model.update({
        lastPing: Sequelize.literal('NOW()'),
        hits: Sequelize.literal('hits + 1'),
    }, {
        where: {
            id,
            isActive: true,
            validUntil: { [Sequelize.Op.gte]: Sequelize.literal('NOW()') },
            endedAt: null,
        },
        returning: true,
        raw: true,
    })

    const record = results[1].shift()
    return record
}

const updateSession = (conn, Model) => async (id, { payload, validUntil }) => {
    const results = await Model.update({
        payload,
        validUntil,
        lastPing: Sequelize.literal('NOW()'),
        hits: Sequelize.literal('hits + 1'),
    }, {
        where: {
            id,
            isActive: true,
            validUntil: { [Sequelize.Op.gte]: Sequelize.literal('NOW()') },
            endedAt: null,
        },
        returning: true,
        raw: true,
    })

    const record = results[1].shift()
    return record
}


const endSession = (conn, Model) => async (id) => {
    const results = await Model.update({
        isActive: false,
        endedAt: Sequelize.literal('NOW()'),
    }, {
        where: { id, isActive: true },
        returning: true,
        raw: true,
    })

    const record = results[1].shift()
    return record
}

const endMultipleSessions = (conn, Model) => async (where) => {
    const results = await Model.update({
        isActive: false,
        endedAt: Sequelize.literal('NOW()'),
    }, {
        where: {
            [Sequelize.Op.and]: [
                { isActive: true },
                where,
            ],
        },
        returning: true,
        raw: true,
    })

    return results[1]
}

export const init = async (conn) => {
    await createHook(CONFIG_SESSION_TOKEN_MODEL, {
        async: 'serie',
        args: { name, fields, options },
    })

    const Model = conn.define(name, fields, options)
    Model.validateSession = validateSession(conn, Model)
    Model.updateSession = updateSession(conn, Model)
    Model.endSession = endSession(conn, Model)
    Model.endMultipleSessions = endMultipleSessions(conn, Model)

    await createHook(DECORATE_SESSION_TOKEN_MODEL, {
        async: 'serie',
        args: { name, fields, options, Model },
    })

    return Model.sync()
}

export const reset = async (conn, Model) => {
    await conn.handler.query(`TRUNCATE ${options.tableName} RESTART IDENTITY CASCADE;`)
}
