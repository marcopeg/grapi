import Sequelize from 'sequelize'
import { CONFIG_SESSION_TOKEN_MODEL, SESSION_DECORATE_RECORD } from '../../feature-session/hooks'
import { FEATURE_NAME } from '../hooks'

export default ({ registerAction }) => {
    registerAction({
        hook: CONFIG_SESSION_TOKEN_MODEL,
        name: FEATURE_NAME,
        handler: ({ fields }) => {
            fields.accountId = {
                type: Sequelize.STRING,
                allowNull: false,
            }
        },
    })

    registerAction({
        hook: SESSION_DECORATE_RECORD,
        name: FEATURE_NAME,
        handler: ({ fields, req }) => {
            fields.accountId = req.authAccountModel.get('id')
        },
    })
}
