import Sequelize from 'sequelize'
import { getModel } from '@forrestjs/service-postgres'

export const issue = async ({ extension, duration }, { req, res }) => {
    // issue the new token for the specific extension name
    const token = await getModel('GraphqlExtensionToken').create({
        extension,
        validUntil: Sequelize.literal(`NOW() + INTERVAL '${duration}'`),
    }, { returning: true })

    // create the JWT
    return token.id
}

export const validate = async ({ token, extension }) => {
    const record = await getModel('GraphqlExtensionToken').findOne({
        where: {
            id: token,
            extension: { [Sequelize.Op.like]: extension.name },
            isActive: true,
            validUntil: { [Sequelize.Op.gte]: Sequelize.literal('NOW()') },
        },
        raw: true,
        attributes: ['id'],
    })

    if (!record) {
        throw new Error(`[graphql-extensions-manager] Invalid or expired token`)
    }

    return record.id
}
