import Sequelize from 'sequelize'
import { sign, verify } from '@forrestjs/service-jwt'
import { getModel } from '@forrestjs/service-postgres'
import uuid from 'uuid/v4'

export const issue = async ({ namespaces }) => {
    const token = await sign({ id: uuid(), namespaces })
    const data = await verify(token)

    // persist the token in the datbase
    await getModel('GraphqlToken').create({
        id: data.payload.id,
        namespaces: data.payload.namespaces,
        validUntil: new Date(data.exp * 1000),
    })

    return token
}

export const validate = async ({ token, extension }) => {
    // pure JWT validation based on the server's secret and payload
    const data = await verify(token)
    if (!data.payload.namespaces.includes(extension.name)) {
        throw new Error(`The namespace "${extension.name}" is not available with this token`)
    }

    // live data validation
    const record = await getModel('GraphqlToken').findOne({
        attributes: [ 'namespaces', 'validUntil' ],
        where: {
            id: data.payload.id,
            isActive: true,
            validUntil: {
                [Sequelize.Op.gte]: Sequelize.literal('NOW()'),
            },
        },
        raw: true,
        // logging: console.log,
    })

    if (!record) {
        throw new Error('Expired token')
    }

    if (!record.namespaces.includes(extension.name)) {
        throw new Error(`The namespace "${extension.name}" is not available with this token`)
    }

    return data
}

export const bump = (tokenId) =>
    getModel('GraphqlToken').bump(tokenId)
