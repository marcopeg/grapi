import Sequelize from 'sequelize'
import requestIp from 'request-ip'
import { FEATURE_NAME } from './hooks'
import { CONFIG_SESSION_TOKEN_MODEL, SESSION_DECORATE_RECORD } from '../feature-session/hooks'

export const register = ({ registerAction, createHook }) => {
    registerAction({
        hook: CONFIG_SESSION_TOKEN_MODEL,
        name: FEATURE_NAME,
        handler: ({ fields }) => {
            fields.ip = {
                type: Sequelize.STRING,
                allowNull: false,
            }
            fields.ua = {
                type: Sequelize.STRING,
                allowNull: false,
            }
        },
    })

    registerAction({
        hook: SESSION_DECORATE_RECORD,
        name: FEATURE_NAME,
        handler: ({ fields, req }) => {
            fields.ip = requestIp.getClientIp(req)
            fields.ua = req.get('User-Agent')
        },
    })
}
