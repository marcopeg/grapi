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

export const parseExtension = definition =>
    buildExtensionSchema({
        name: definition.name,
        shouldRunQueries: definition.shouldRunQueries,
        shouldRunMutations: definition.shouldRunMutations,
        ...(definition.types ? { types: reduceTypes(definition.types) } : {}),
        ...(definition.inputTypes ? { inputTypes: reduceTypes(definition.inputTypes) } : {}),
        ...(definition.queries ? { queries: reduceQueries(definition.queries) } : {}),
        ...(definition.mutations ? { mutations: reduceQueries(definition.mutations) } : {}),
    })

// Reversed

const reduceTypeFieldsReversed = fields =>
    Object.keys(fields).reduce((acc, key) => [
        ...acc,
        { name: key, type: fields[key] },
    ], [])

const reduceTypeHeadersReversed = fields =>
    Object.keys(fields).reduce((acc, key) => [
        ...acc,
        { name: key, value: fields[key] },
    ], [])

const reduceTypesReversed = types =>
    Object.keys(types).reduce((acc, key) => [
        ...acc,
        { name: key, fields: reduceTypeFieldsReversed(types[key]) },
    ], [])

const reduceResolverReversed = resolve => ({
    type: resolve.type,
    url: resolve.url,
    query: resolve.query,
    grab: resolve.grab,
    ...(resolve.headers ? { headers: reduceTypeHeadersReversed(resolve.headers) } : {}),
    ...(resolve.body ? { body: reduceTypeHeadersReversed(resolve.body) } : {}),
})

const reduceQueriesReversed = queries =>
    Object.keys(queries).reduce((acc, key) => [
        ...acc,
        {
            name: key,
            type: queries[key].type,
            resolve: reduceResolverReversed(queries[key].resolve),
            ...(queries[key].args ? { args: reduceTypeFieldsReversed(queries[key].args) } : {}),
        },
    ], [])

export const reverseParseExtension = definition => ({
    name: definition.name,
    shouldRunQueries: definition.shouldRunQueries,
    shouldRunMutations: definition.shouldRunMutations,
    ...(definition.types ? { types: reduceTypesReversed(definition.types) } : {}),
    ...(definition.inputTypes ? { inputTypes: reduceTypesReversed(definition.inputTypes) } : {}),
    ...(definition.queries ? { queries: reduceQueriesReversed(definition.queries) } : {}),
})
