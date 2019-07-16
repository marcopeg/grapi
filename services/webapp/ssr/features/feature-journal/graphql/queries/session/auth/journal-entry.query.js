
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
    resolve: async (auth, args) => {
        const entry = await getModel('JournalEntry').findOneEncrypted({
            accountId: auth.id,
            ...args,
        })

        // default into a new document for the day
        return entry || {
            accountId: auth.id,
            day: args.day,
            content: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    },
})
