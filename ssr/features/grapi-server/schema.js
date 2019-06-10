/**
 * createSchema() builds a cached GraphQL schema with all
 * the registered extensions.
 *
 * The cache invalidation is based on a simple numeric etag that
 * gets bumped every time an extension is being registered.
 */

import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql'
import registerExtension from './register-extension.mutation'
import { get as getExtensions } from './extensions'
import { parseExtension } from '../../utils/graphql-parser'

const info = {
    description: 'Provides info regarding the project',
    type: GraphQLString,
    resolve: () => `GraphQL is working`,
}

const initialQueries = { info }
const initialMutations = { info, registerExtension }

const cache = {
    etag: -1,
    schema: null,
}

// Inject extensions into queries and mutations
const addExtensions = ({ queries, mutations, extensions }) =>
    extensions.reduce(({ queries, mutations }, definition) => {
        const extension = parseExtension(definition)
        return {
            queries: {
                ...queries,
                ...extension.queries,
            },
            mutations: {
                ...mutations,
                ...extension.mutations,
            },
        }
    }, { queries, mutations })

export const createSchema = () => {
    const [ etag, extensions ] = getExtensions()

    // test cache
    if (cache.etag === etag) {
        return cache.schema
    }

    const { queries, mutations } = addExtensions({
        queries: initialQueries,
        mutations: initialMutations,
        extensions,
    })

    const schema = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: 'RootQuery',
            fields: queries,
        }),
        mutation: new GraphQLObjectType({
            name: 'RootMutation',
            fields: mutations,
        }),
    })

    // write cache
    cache.etag = etag
    cache.schema = schema

    return schema
}
