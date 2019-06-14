import { POSTGRES_BEFORE_START } from '@forrestjs/service-postgres/lib/hooks'
import { FEATURE_NAME } from '../hooks'
import * as authAccountModel from '../auth-account.model'

export default ({ registerAction, createHook }) => {
    registerAction({
        hook: `${POSTGRES_BEFORE_START}/default`,
        name: FEATURE_NAME,
        handler: ({ options }) => {
            options.models.push(authAccountModel)
        },
    })
}
