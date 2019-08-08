import Sequelize from 'sequelize'

export const name = 'GraphqlToken'

const fields = {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    hits: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
    namespaces: {
        type: Sequelize.ARRAY(Sequelize.STRING), // eslint-disable-line
        allowNull: false,
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
    },
    validUntil: {
        type: Sequelize.DATE,
        allowNull: false,
    },
}

const options = {
    tableName: 'graphql_tokens',
    freezeTableName: true,
    underscored: true,
}

const bump = (_, Model) => async id =>
    Model.increment('hits', { where: { id } })

export const init = (conn) => {
    const Model = conn.define(name, fields, options)
    Model.bump = bump(conn, Model)
    return Model.sync()
}

export const reset = async (conn, Model) => {
    await conn.handler.query(`TRUNCATE ${options.tableName} RESTART IDENTITY CASCADE;`)
}
