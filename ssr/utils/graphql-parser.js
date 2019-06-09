import { GraphQLID, GraphQLInt, GraphQLFloat, GraphQLString, GraphQLBoolean } from 'graphql'
import { GraphQLNonNull, GraphQLList } from 'graphql'
import { GraphQLObjectType, GraphQLInputObjectType } from 'graphql'

const getTypeName = (name, options = {}) =>
    options.alias ? `${options.alias}__${name}` : name

const parseQueryResolver = (source) =>
    typeof source === 'function'
        ? source
        : null

const parseExtensionResolver = (source) => {
    if (source === true) {
        return () => true
    }

    return typeof source === 'function'
        ? source
        : null
}

export const parseField = (receivedInput, types, options) => {
    const input = receivedInput.trim()

    if (input[input.length - 1] === '!') {
        const type = parseField(input.substr(0, input.length - 1), types, options)
        return new GraphQLNonNull(type)
    }

    if (input[0] === '[' && input[input.length - 1] === ']') {
        const type = parseField(input.substr(1, input.length - 2), types, options)
        return new GraphQLList(type)
    }

    switch (input) {
        case 'ID':
            return GraphQLID
        case 'Int':
            return GraphQLInt
        case 'Float':
            return GraphQLFloat
        case 'String':
            return GraphQLString
        case 'Boolean':
            return GraphQLBoolean
        default:
            return types[getTypeName(input, options)] || types[input]
    }
}

export const parseObject = (def, types, options) => {
    const { name, description, fields } = def
    const { __description, __type, ...realFields } = fields

    const addField = (acc, curr) => ({
        ...acc,
        [curr]: { type: parseField(realFields[curr], types, options) },
    })

    switch (__type) {
        case 'input':
            return new GraphQLInputObjectType({
                name: getTypeName(name, options),
                description: __description || description,
                fields: Object.keys(realFields).reduce(addField, {}),
            })
        default:
            return new GraphQLObjectType({
                name: getTypeName(name, options),
                description: __description || description,
                fields: Object.keys(realFields).reduce(addField, {}),
            })
    }
}

export const parseTypes = (types, options = {}) =>
    Object.keys(types).reduce((acc, curr) => ({
        ...acc,
        [getTypeName(curr, options)]: typeof types[curr] === 'string'
            ? parseField(types[curr], acc, options)
            : parseObject({
                name: curr,
                fields: types[curr],
            }, acc, options),
    }), options.types || {})

export const parseInputTypes = (types, options = {}) =>
    Object.keys(types).reduce((acc, curr) => ({
        ...acc,
        [getTypeName(curr, options)]: typeof types[curr] === 'string'
            ? parseField(types[curr], acc, options)
            : parseObject({
                name: curr,
                fields: {
                    __type: 'input',
                    ...types[curr],
                },
            }, acc, options),
    }), options.types || {})

export const parseEndpointArgs = (args, types, options) =>
    Object.keys(args).reduce((acc, curr) => ({
        ...acc,
        [curr]: {
            type: typeof args[curr] === 'string'
                ? parseField(args[curr], types, options)
                : parseObject({
                    name: curr,
                    fields: args[curr],
                }, types, options),
        },
    }), {})

export const parseEndpoints = (endpoints, types, options) =>
    Object.keys(endpoints).reduce((acc, curr) => {
        if (typeof endpoints[curr] === 'string') {
            return {
                ...acc,
                [curr]: { type: parseField(endpoints[curr], types, options) },
            }
        }

        const args = endpoints[curr].args
            ? parseEndpointArgs(endpoints[curr].args, types, options)
            : {}

        const type = typeof endpoints[curr].type === 'string'
            ? parseField(endpoints[curr].type, types, options)
            : parseObject({
                name: curr,
                fields: endpoints[curr].type,
            }, types, options)

        const resolve = endpoints[curr].resolve
            ? { resolve: parseQueryResolver(endpoints[curr].resolve) }
            : {}

        return {
            ...acc,
            [curr]: {
                args,
                type,
                ...resolve,
            },
        }
    }, {})

export const parseExtension = (config) => {
    const options = { alias: config.name }
    const types = {
        ...parseInputTypes(config.inputTypes || {}, options),
        ...parseTypes(config.types || {}, options),
    }

    return {
        queries: config.queries
            ? {
                [config.name]: {
                    ...(config.shouldRunQueries
                        ? { resolve: parseExtensionResolver(config.shouldRunQueries) }
                        : {}
                    ),
                    type: new GraphQLObjectType({
                        name: `${config.name}Query`,
                        fields: parseEndpoints(config.queries, types, options),
                    }),
                },
            }
            : {},
        mutations: config.mutations
            ? {
                [config.name]: {
                    ...(config.shouldRunMutations
                        ? { resolve: parseExtensionResolver(config.shouldRunMutations) }
                        : {}
                    ),
                    type: new GraphQLObjectType({
                        name: `${config.name}Mutation`,
                        fields: parseEndpoints(config.mutations, types, options),
                    }),
                },
            }
            : {},
    }
}
