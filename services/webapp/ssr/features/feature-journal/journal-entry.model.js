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
        type: Sequelize.TEXT,
        defaultValue: '{}',
    },
}

const options = {
    tableName: 'journal_entries',
    freezeTableName: true,
    underscored: true,
}

const upsertEncrypted = (conn, Model, encryptionKey) => async ({ accountId, day, content }) =>
    Model.upsert({
        accountId,
        day,
        content: Sequelize.literal(`PGP_SYM_ENCRYPT('${JSON.stringify(content)}', '${encryptionKey}')`),
    }, {
        where: {
            accountId,
            day,
        },
        returning: true,
    })

const findOneEncrypted = (conn, Model, encryptionKey) => async ({ accountId, day }) => {
    const data = await Model.findOne({
        where: {
            accountId,
            day,
        },
        attributes: [
            [ 'account_id', 'accountId' ],
            'day',
            [ Sequelize.literal(`PGP_SYM_DECRYPT(content::bytea, '${encryptionKey}')`), 'content' ],
            [ 'created_at', 'createdAt' ],
            [ 'updated_at', 'updatedAt' ],
        ],
        raw: true,
    })

    return data ? {
        ...data,
        content: JSON.parse(data.content),
    } : null
}

export const init = async (conn, { getEnv }) => {
    const encryptionKey = getEnv('PG_ENCRYPTION_KEY')
    const Model = conn.define(name, fields, options)
    Model.upsertEncrypted = upsertEncrypted(conn, Model, encryptionKey)
    Model.findOneEncrypted = findOneEncrypted(conn, Model, encryptionKey)

    await conn.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;')
    return Model.sync()
}
