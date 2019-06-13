import Sequelize from 'sequelize'

export const name = 'SessionToken'

const fields = {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
    validations: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
    },
    extensions: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    validUntil: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    lastPing: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    lastExtended: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    payload: {
        type: Sequelize.JSONB,
        defaultValue: {},
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
        validations: Sequelize.literal('validations + 1'),
    }, {
        where: {
            id,
            isActive: true,
            validUntil: {
                [Sequelize.Op.gte]: Sequelize.literal('NOW()'),
            },
        },
        returning: true,
        raw: true,
    })

    const record = results[1].shift()
    return record
}

export const init = (conn) => {
    const Model = conn.define(name, fields, options)
    Model.validateSession = validateSession(conn, Model)
    return Model.sync()
}

export const reset = async (conn, Model) => {
    await conn.handler.query(`TRUNCATE ${options.tableName} RESTART IDENTITY CASCADE;`)
}
