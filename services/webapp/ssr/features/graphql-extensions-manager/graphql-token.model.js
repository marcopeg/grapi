import Sequelize from 'sequelize'

export const name = 'GraphqlExtensionToken'

const fields = {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    extension: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
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
    tableName: 'graphql_extensions_tokens',
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
