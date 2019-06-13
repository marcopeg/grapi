import Sequelize from 'sequelize'

export const name = 'GraphqlNamespace'

const fields = {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    accountId: {
        type: Sequelize.BIGINT,
        allowNull: false,
    },
    namespace: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
}

const options = {
    tableName: 'graphql_namespaces',
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
