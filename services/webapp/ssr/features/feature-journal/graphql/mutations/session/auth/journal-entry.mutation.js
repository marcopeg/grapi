import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLYYYYMMDD as GraphQLDate } from 'graphql-moment'
import { getModel } from '@forrestjs/service-postgres'
import { GraphQLJournalEntryContentInput } from '../../../types/journal-entry-content.input'
import { GraphQLJournalEntry } from '../../../types/journal-entry.type'

export const journalEntryMutation = async () => ({
    description: 'Writes a journal entry related to the identity',
    args: {
        day: {
            type: GraphQLDate,
            defaultValue: new Date(),
        },
        key: {
            type: new GraphQLNonNull(GraphQLString),
        },
        content: {
            type: new GraphQLNonNull(new GraphQLList(GraphQLJournalEntryContentInput)),
        },
    },
    type: GraphQLJournalEntry,
    resolve: async (auth, args) => {
        const [model] = await getModel('JournalEntry').upsertEncrypted({
            accountId: auth.id,
            day: args.day,
            content: args.content,
        }, args.key)

        return model
    },
})
