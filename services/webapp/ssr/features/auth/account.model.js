import Sequelize from 'sequelize'
import { encode, compare } from '@forrestjs/service-hash'

export const name = 'AuthAccount'

const fields = {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    uname: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        // validate: {
        //     isEmail: true,
        // },
    },
    passw: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    // 0: pending
    // 1: confirmed
    // -1: deleted
    status: {
        type: Sequelize.SMALLINT,
        defaultValue: 0,
    },
    etag: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
    lastLogin: {
        type: Sequelize.DATE,
        field: 'last_login',
    },
}

const options = {
    tableName: 'auth_accounts',
    freezeTableName: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        beforeCreate: async (user) => {
            user.passw = await encode(user.passw)
        },
        beforeUpdate: async (user) => {
            if (user.passw) {
                user.passw = await encode(user.passw)
            }
        },
        beforeBulkUpdate: async (change) => {
            if (change.attributes.passw) {
                change.attributes.passw = await encode(change.attributes.passw)
            }
        },
    },
}

const register = (conn, Model) => (values) =>
    Model.create(values, {
        fields: [
            'uname',
            'passw',
            'status',
        ],
        raw: true,
    })

const updateByUsername = (conn, Model) => (uname, values) =>
    Model.update(values, {
        where: { uname },
        fields: [
            'passw',
            'status',
        ],
        returning: true,
        raw: true,
    })

const findLogin = (conn, Model) => async (uname, passw) => {
    const record = await Model.findOne({
        where: {
            uname,
            status: 1,
        },
        raw: true,
        // logging: console.log,
    })

    if (!record) {
        return null
    }

    if (!await compare(passw, record.passw)) {
        return false
    }

    return record
}

const bumpLastLogin = (conn, Model) => async userId =>
    Model.update({
        lastLogin: Sequelize.literal('NOW()'),
    }, {
        where: {
            id: userId,
        },
        // logging: console.log,
    })

const validateSession = (conn, Model) => async (userId, etag, status = [ 0, 1 ]) => {
    const record = await Model.findOne({
        attributes: ['id'],
        where: {
            id: userId,
            etag,
            status: { [Sequelize.Op.in]: status },
        },
        raw: true,
        // logging: console.log,
    })

    if (!record) {
        throw new Error('not found')
    }

    return record
}

export const init = (conn) => {
    const Model = conn.define(name, fields, options)
    Model.register = register(conn, Model)
    Model.updateByUsername = updateByUsername(conn, Model)
    Model.findLogin = findLogin(conn, Model)
    Model.bumpLastLogin = bumpLastLogin(conn, Model)
    Model.validateSession = validateSession(conn, Model)
    return Model.sync()
}

export const reset = async (conn, Model) => {
    await conn.handler.query(`TRUNCATE ${options.tableName} RESTART IDENTITY CASCADE;`)
}
