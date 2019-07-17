import { GraphQLNonNull, GraphQLString } from 'graphql'
import { getModel } from '@forrestjs/service-postgres'

export const journalSetKeyMutation = async () => ({
    description: 'Updates the encrypted data with a new key ',
    args: {
        oldKey: {
            type: new GraphQLNonNull(GraphQLString),
        },
        newKey: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
    type: GraphQLString,
    resolve: async (auth, args) => {
        const res = await getModel('JournalEntry').updateUserEncryptionKey({
            ...args,
            accountId: auth.id,
        })

        console.log(res)

        return 'yes'
    },
})
