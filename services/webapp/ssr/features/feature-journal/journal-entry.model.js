import Sequelize from 'sequelize'

export const name = 'JournalEntry'

const fields = {
    accountId: {
        primaryKey: true,
        type: Sequelize.UUID,
    },
    day: {
        primaryKey: true,
        type: Sequelize.DATEONLY,
        defaultValue: new Date(),
    },
    content: {
        type: Sequelize.JSONB,
        defaultValue: {},
    },
}

const options = {
    tableName: 'journal_entries',
    freezeTableName: true,
    underscored: true,
}


export const init = (conn) => {
    const Model = conn.define(name, fields, options)
    return Model.sync()
}
