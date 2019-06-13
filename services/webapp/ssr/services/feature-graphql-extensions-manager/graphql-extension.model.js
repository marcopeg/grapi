import Sequelize from 'sequelize'

export const name = 'GraphqlExtension'

const fields = {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    namespace: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    definition: {
        type: Sequelize.JSONB,
        allowNull: false,
    },
}

const options = {
    tableName: 'graphql_extensions',
    freezeTableName: true,
    underscored: true,
}


export const init = (conn) => {
    const Model = conn.define(name, fields, options)
    return Model.sync()
}

export const reset = async (conn, Model) => {
    await conn.handler.query(`TRUNCATE ${options.tableName} RESTART IDENTITY CASCADE;`)
}
