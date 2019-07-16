import { GraphQLYYYYMMDD as GraphQLDate } from 'graphql-moment'
import { getModel } from '@forrestjs/service-postgres'
import { GraphQLJournalEntry } from '../../../types/journal-entry.type'

export const journalEntryQuery = async () => ({
    description: 'Reads a journal entry related to the identity',
    args: {
        day: {
            type: GraphQLDate,
            defaultValue: new Date(),
        },
    },
    type: GraphQLJournalEntry,
    resolve: async (auth, args, { req, res }) =>
        getModel('JournalEntry').findOne({
            where: {
                accountId: auth.id,
                ...args,
            },
            raw: true,
        }),
})
