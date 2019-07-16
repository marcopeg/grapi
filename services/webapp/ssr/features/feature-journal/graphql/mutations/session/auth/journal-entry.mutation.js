import { GraphQLList, GraphQLNonNull } from 'graphql'
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
        content: {
            type: new GraphQLNonNull(new GraphQLList(GraphQLJournalEntryContentInput)),
        },
    },
    type: GraphQLJournalEntry,
    resolve: async (auth, args) => {
        const [model] = await getModel('JournalEntry').upsert({
            accountId: auth.id,
            day: args.day,
            content: args.content,
        }, {
            where: {
                accountId: auth.id,
                day: args.day,
            },
            returning: true,
        })

        return model
    },
})
