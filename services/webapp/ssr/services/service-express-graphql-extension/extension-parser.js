/**
 * It converts from a GraphQL compatible defintion to an object based
 * definition that is used by "graphql-extension".
 */

import { parseExtension as buildExtensionSchema } from 'graphql-extension'

const reduceFields = fields =>
    fields.reduce(
        (acc, curr) => ({
            ...acc,
            [curr.name]: curr.type,
        }),
        {}
    )

const reduceTypes = types =>
    types.reduce(
        (acc, curr) => ({
            ...acc,
            [curr.name]: reduceFields(curr.fields),
        }),
        {}
    )

const reduceHeaders = fields =>
    fields.reduce(
        (acc, curr) => ({
            ...acc,
            [curr.name]: curr.value,
        }),
        {}
    )

const reduceResolver = resolver => ({
    type: resolver.type,
    url: resolver.url,
    ...(resolver.method ? { method: resolver.method } : {}),
    ...(resolver.query ? { query: resolver.query } : {}),
    ...(resolver.grab ? { grab: resolver.grab } : {}),
    ...(resolver.headers ? { headers: reduceHeaders(resolver.headers) } : {}),
    ...(resolver.body ? { body: reduceHeaders(resolver.body) } : {}),
})

const reduceQueries = queries =>
    queries.reduce(
        (acc, curr) => ({
            ...acc,
            [curr.name]: {
                type: curr.type,
                ...(curr.args ? { args: reduceFields(curr.args) } : {}),
                resolve: reduceResolver(curr.resolve),
            },
        }),
        {}
    )

/**
 * definition.__type === 'gql'
 * means that the file format uses the long array list, the structure
 * that can be validated via GraphQL
 *
 * In that case there is the need to translate that format into the
 * normal JSON object based that is used by `graphql-extension`.
 */
export const parseExtension = (definition, options) =>
    definition.__type === 'gql'
        ? buildExtensionSchema({
            name: definition.name,
            shouldRunQueries: definition.shouldRunQueries,
            shouldRunMutations: definition.shouldRunMutations,
            ...(definition.types ? { types: reduceTypes(definition.types) } : {}),
            ...(definition.inputTypes ? { inputTypes: reduceTypes(definition.inputTypes) } : {}),
            ...(definition.queries ? { queries: reduceQueries(definition.queries) } : {}),
            ...(definition.mutations ? { mutations: reduceQueries(definition.mutations) } : {}),
        }, options)
        : buildExtensionSchema(definition, options)
