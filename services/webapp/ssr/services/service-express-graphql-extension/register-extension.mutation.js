import {
    GraphQLNonNull,
    GraphQLInputObjectType,
    GraphQLEnumType,
    GraphQLList,
    GraphQLString,
    GraphQLBoolean,
} from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import { registerExtensionResolver } from './register-extension.resolver'

const GraphQLExtensionRestMethods = new GraphQLEnumType({
    name: 'GraphQLExtension__RestMethods',
    values: {
        GET: { value: 'GET' },
        PUT: { value: 'PUT' },
        POST: { value: 'POST' },
    },
})

const GraphQLExtensionResolveTypes = new GraphQLEnumType({
    name: 'GraphQLExtension__ResolveTypes',
    values: {
        rest: { value: 'rest' },
        graphql: { value: 'graphql' },
    },
})

const GraphQLExtensionField = new GraphQLInputObjectType({
    name: 'GraphQLExtension__Field',
    description: 'GraphQL Extension Field definition',
    fields: {
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
        type: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
})

const GraphQLExtensionHeader = new GraphQLInputObjectType({
    name: 'GraphQLExtension__Header',
    description: 'GraphQL Extension Header field definition',
    fields: {
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
        value: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
})

const GraphQLExtensionBody = new GraphQLInputObjectType({
    name: 'GraphQLExtension__Body',
    description: 'GraphQL Extension Body field definition',
    fields: {
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
        value: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
})

const GraphQLExtensionType = new GraphQLInputObjectType({
    name: 'GraphQLExtension__Type',
    description: 'GraphQL Extension Type definition',
    fields: {
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
        fields: {
            type: new GraphQLList(GraphQLExtensionField),
        },
    },
})

const GraphQLExtensionResolver = new GraphQLInputObjectType({
    name: 'GraphQLExtension__Resolver',
    description: 'GraphQL Extension Resolver definition',
    fields: {
        type: {
            type: new GraphQLNonNull(GraphQLExtensionResolveTypes),
        },
        url: {
            type: new GraphQLNonNull(GraphQLString),
        },
        method: {
            type: GraphQLExtensionRestMethods,
        },
        query: {
            type: GraphQLString,
        },
        headers: {
            type: new GraphQLList(GraphQLExtensionHeader),
        },
        body: {
            type: new GraphQLList(GraphQLExtensionBody),
        },
        grab: {
            type: GraphQLString,
        },
    },
})

const GraphQLExtensionQuery = new GraphQLInputObjectType({
    name: 'GraphQLExtension__Query',
    description: 'GraphQL Extension Query definition',
    fields: {
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
        args: {
            type: new GraphQLList(GraphQLExtensionField),
        },
        type: {
            type: new GraphQLNonNull(GraphQLString),
        },
        resolve: {
            type: new GraphQLNonNull(GraphQLExtensionResolver),
        },
    },
})

const GraphQLExtensionMutation = new GraphQLInputObjectType({
    name: 'GraphQLExtension__Mutation',
    description: 'GraphQL Extension Mutation definition',
    fields: {
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
        args: {
            type: new GraphQLList(GraphQLExtensionField),
        },
        type: {
            type: new GraphQLNonNull(GraphQLString),
        },
        resolve: {
            type: new GraphQLNonNull(GraphQLExtensionResolver),
        },
    },
})

const GraphQLExtension = new GraphQLInputObjectType({
    name: 'GraphQLExtension',
    description: 'GraphQL Extension definition',
    fields: {
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
        types: {
            type: new GraphQLList(GraphQLExtensionType),
        },
        inputTypes: {
            type: new GraphQLList(GraphQLExtensionType),
        },
        queries: {
            type: new GraphQLList(GraphQLExtensionQuery),
        },
        mutations: {
            type: new GraphQLList(GraphQLExtensionMutation),
        },
        shouldRunQueries: {
            type: new GraphQLNonNull(GraphQLBoolean),
        },
        shouldRunMutations: {
            type: new GraphQLNonNull(GraphQLBoolean),
        },
    },
})

export default () => ({
    description: 'Register or updates an GraphQL Extension using a typed validated definition',
    args: {
        definition: {
            type: new GraphQLNonNull(GraphQLExtension),
        },
        // @TODO: Define hard types here!
        rules: {
            type: GraphQLJSON,
            defaultValue: {},
        },
        token: {
            type: GraphQLString,
            defaultValue: null,
        },
    },
    type: GraphQLJSON,
    resolve: (_, args, req) => {
        const { definition, ...otherArgs } = args
        registerExtensionResolver({
            ...otherArgs,
            definition: {
                ...definition,
                __type: 'gql',
            },
        }, req)
    },
})
