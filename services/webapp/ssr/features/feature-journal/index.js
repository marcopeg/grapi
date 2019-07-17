// import Sequelize from 'sequelize'
import { POSTGRES_BEFORE_START } from '@forrestjs/service-postgres/lib/hooks'
import * as hooks from './hooks'
import * as journalEntryModel from './journal-entry.model'
import { journalEntryQuery } from './graphql/queries/session/auth/journal-entry.query'
import { journalEntryMutation } from './graphql/mutations/session/auth/journal-entry.mutation'
import { journalSetKeyMutation } from './graphql/mutations/session/auth/journal-set-key.mutation'

export default ({ registerHook, registerAction }) => {
    registerHook(hooks)

    // Add Auth Data Model
    registerAction({
        hook: `${POSTGRES_BEFORE_START}/default`,
        name: hooks.FEATURE_NAME,
        handler: ({ registerModel }) => {
            registerModel(journalEntryModel)
        },
    })

    registerAction({
        hook: '$PG_AUTH_GRAPHQL',
        name: hooks.FEATURE_NAME,
        handler: async ({ registerQuery, registerMutation }) => {
            registerQuery('journalEntry', await journalEntryQuery())
            registerMutation('journalEntry', await journalEntryMutation())
            registerMutation('journalSetKey', await journalSetKeyMutation())
        },
    })
}
