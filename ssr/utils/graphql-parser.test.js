import 'babel-polyfill'

import { GraphQLID, GraphQLInt, GraphQLFloat, GraphQLString, GraphQLBoolean } from 'graphql'
import { GraphQLNonNull, GraphQLList } from 'graphql'
import { GraphQLSchema, GraphQLObjectType } from 'graphql'
import { graphql } from 'graphql'

import { parseField, parseObject, parseTypes, parseInputTypes, parseEndpoints, parseExtension } from './graphql-parser'

describe('graphql-parser', () => {
    describe('parseField()', () => {
        test('it should parse scalars', () => {
            expect(parseField('ID')).toBe(GraphQLID)
            expect(parseField('Int')).toBe(GraphQLInt)
            expect(parseField('Float')).toBe(GraphQLFloat)
            expect(parseField('String')).toBe(GraphQLString)
            expect(parseField('Boolean')).toBe(GraphQLBoolean)
        })

        test('it should parse required fields', () => {
            const res = parseField('ID!')
            expect(res).toBeInstanceOf(GraphQLNonNull)
            expect(res.ofType).toBe(GraphQLID)
        })

        test('it should parse a list definition', () => {
            const res = parseField('[ID]')
            expect(res).toBeInstanceOf(GraphQLList)
            expect(res.ofType).toBe(GraphQLID)
        })

        test('it should parse nested NonNull definitions', () => {
            const res = parseField('[ID!]!')
            expect(res).toBeInstanceOf(GraphQLNonNull)
            expect(res.ofType).toBeInstanceOf(GraphQLList)
            expect(res.ofType.ofType).toBeInstanceOf(GraphQLNonNull)
            expect(res.ofType.ofType.ofType).toBe(GraphQLID)
        })

        test('it should parse a definition that contains spaces', () => {
            const res = parseField('[  ID !    ] !     ')
            expect(res).toBeInstanceOf(GraphQLNonNull)
            expect(res.ofType).toBeInstanceOf(GraphQLList)
            expect(res.ofType.ofType).toBeInstanceOf(GraphQLNonNull)
            expect(res.ofType.ofType.ofType).toBe(GraphQLID)
        })
    })

    describe('parseObject()', () => {
        test('it should parse an object definition made of scalars', async () => {
            const UserType = parseObject({
                name: 'User',
                description: 'user type',
                fields: {
                    id: 'Int!',
                    name: 'String!',
                    hobbies: '[String]',
                },
            })

            const schema = new GraphQLSchema({
                query: new GraphQLObjectType({
                    name: 'RootQuery',
                    fields: {
                        user: { type: UserType },
                    },
                }),
            })

            const root = {
                user: () => ({
                    id: 22,
                    name: 'Marco',
                    hobbies: [ 'foo1', 'foo2' ],
                }),
            }

            const query = '{ user { id, name, hobbies } }'

            const res = await graphql(schema, query, root)
            expect(res.data.user).toEqual({
                id: 22,
                name: 'Marco',
                hobbies: [ 'foo1', 'foo2' ],
            })
        })

        test('it should parse an object that was built, previously', async () => {
            const types = {}
            types.User = parseObject({
                name: 'User',
                description: 'user type',
                fields: {
                    id: 'Int!',
                    name: 'String!',
                },
            })

            types.UsersList = parseObject({
                name: 'UserList',
                description: 'a list of users',
                fields: {
                    items: '[User]!',
                },
            }, types)

            const schema = new GraphQLSchema({
                query: new GraphQLObjectType({
                    name: 'RootQuery',
                    fields: {
                        users: { type: types.UsersList },
                    },
                }),
            })

            const root = {
                users: () => ({
                    items: [{
                        id: 22,
                        name: 'Marco',
                    }],
                }),
            }

            const query = '{ users { items { id name } } }'

            const res = await graphql(schema, query, root)
            expect(res.data.users).toEqual({
                items: [{
                    id: 22,
                    name: 'Marco',
                }],
            })
        })
    })

    describe('parseTypes()', () => {
        test('it should parse multiple interconnected and aliased types', async () => {
            const types = parseTypes({
                User: {
                    id: 'Int!',
                    name: 'String',
                },
                UsersList: '[User!]!',
            }, { alias: 'MyAlias' })

            const schema = new GraphQLSchema({
                query: new GraphQLObjectType({
                    name: 'RootQuery',
                    fields: {
                        users: { type: types.MyAlias__UsersList },
                    },
                }),
            })

            const root = {
                users: () => [{
                    id: 22,
                    name: 'Marco',
                }],
            }

            const query = '{ users { id name } }'

            const res = await graphql(schema, query, root)
            expect(res.data.users).toEqual([{
                id: 22,
                name: 'Marco',
            }])
        })

        test('it should handle aliased input types', async () => {
            const inputTypes = parseInputTypes({
                UserInput: {
                    id: 'Int!',
                    name: 'String!',
                },
            }, { alias: 'MyAlias' })

            const types = parseTypes({
                User: {
                    id: 'Int!',
                    name: 'String',
                },
                UsersList: '[User!]!',
            }, { alias: 'MyAlias' })

            const schema = new GraphQLSchema({
                query: new GraphQLObjectType({
                    name: 'RootQuery',
                    fields: {
                        users: {
                            args: {
                                user: { type: inputTypes.MyAlias__UserInput },
                            },
                            type: types.MyAlias__UsersList,
                        },
                    },
                }),
            })

            const root = {
                users: (args) => [args.user],
            }

            const query = '{ users ( user: { id: 22, name: "Marco" } ) { id name } }'

            const res = await graphql(schema, query, root)
            // console.log(JSON.stringify(res))
            expect(res.data.users).toEqual([{
                id: 22,
                name: 'Marco',
            }])
        })
    })

    describe('parseEndpoints()', () => {
        test('it should build a group of endpoints', async () => {
            const types = {
                ...parseInputTypes({
                    UserInput: {
                        id: 'Int!',
                    },
                }, { alias: 'MyAlias' }),
                ...parseTypes({
                    User: {
                        id: 'Int!',
                        name: 'String',
                    },
                    UsersList: '[User!]',
                }, { alias: 'MyAlias' }),
            }

            const fields = parseEndpoints({
                listUsers: {
                    args: {
                        name: 'String!',
                        user: 'UserInput!',
                    },
                    type: 'UsersList!',
                },
            }, types, { alias: 'MyAlias' })

            const schema = new GraphQLSchema({
                query: new GraphQLObjectType({
                    name: 'RootQuery',
                    fields,
                }),
            })

            const root = {
                listUsers: (args) => [{ id: args.user.id, name: args.name }],
            }

            const query = '{ listUsers (name: "Marco", user: {id:22}) { id name } }'

            const res = await graphql(schema, query, root)
            // console.log(JSON.stringify(res))
            expect(res.data.listUsers).toEqual([{
                id: 22,
                name: 'Marco',
            }])
        })

        test('it should wrap queries from a given extension', async () => {
            const fields = parseEndpoints({
                foo: 'String!',
            }, {}, { alias: 'MyAlias' })

            const root = {
                MyExtension: () => ({
                    foo: () => 'foo',
                }),
            }

            const schema = new GraphQLSchema({
                query: new GraphQLObjectType({
                    name: 'RootQuery',
                    fields: {
                        MyExtension: {
                            type: new GraphQLObjectType({
                                name: 'MyExtension',
                                fields,
                            }),
                        },
                    },
                }),
            })

            const query = '{ MyExtension { foo } }'

            const res = await graphql(schema, query, root)
            // console.log(JSON.stringify(res))
            expect(res.data.MyExtension.foo).toBe('foo')
        })
    })

    describe('parseExtension()', () => {
        test('it should run a basic extension', async () => {
            const { queries, mutations } = parseExtension({
                name: 'MyExtension',
                inputTypes: {
                    UserInput: {
                        id: 'Int!',
                        name: 'String!',
                    },
                },
                types: {
                    User: {
                        id: 'Int!',
                        name: 'String!',
                    },
                },
                queries: {
                    getUser: 'User!',
                },
                mutations: {
                    setUser: {
                        args: { user: 'UserInput!' },
                        type: '[User!]!',
                    },
                },
            })

            const schema = new GraphQLSchema({
                query: new GraphQLObjectType({
                    name: 'RootQuery',
                    fields: { ...queries },
                }),
                mutation: new GraphQLObjectType({
                    name: 'RootMutation',
                    fields: { ...mutations },
                }),
            })

            const root = {
                MyExtension: () => ({
                    getUser: () => ({ id: 1, name: 'Marco' }),
                    setUser: ({ user }) => [user],
                }),
            }

            const r1 = await graphql(schema, 'query q1 { MyExtension { getUser { id name } } }', root)
            expect(r1.data.MyExtension.getUser).toEqual({
                id: 1,
                name: 'Marco',
            })

            const r2 = await graphql(schema, 'mutation q1 { MyExtension { setUser ( user: { id: 1, name: "Marco" }) { id name } } }', root)
            expect(r2.data.MyExtension.setUser).toEqual([{
                id: 1,
                name: 'Marco',
            }])
        })

        test('it should run an extension with embed resolvers', async () => {
            const { queries } = parseExtension({
                name: 'MyExtension',
                queries: {
                    foo: {
                        type: 'String',
                        resolve: () => 'foo',
                    },
                },
                shouldRunQueries: true,
            })

            const schema = new GraphQLSchema({
                query: new GraphQLObjectType({
                    name: 'RootQuery',
                    fields: { ...queries },
                }),
            })

            const r1 = await graphql(schema, 'query q1 { MyExtension { foo }}')
            expect(r1.data.MyExtension.foo).toBe('foo')
        })
    })

    describe('parseQueryResolver()', () => {
        test('it should be able to use external data', async () => {
            const { queries } = parseExtension({
                name: 'MyExtension',
                types: {
                    User: {
                        id: 'ID!',
                        name: 'String',
                    },
                    Continent: {
                        code: 'ID!',
                        name: 'String',
                    },
                },
                queries: {
                    users: {
                        type: '[User]',
                        resolve: {
                            type: 'rest',
                            url: 'https://jsonplaceholder.typicode.com/users',
                        },
                    },
                    user: {
                        type: 'User',
                        args: {
                            id: 'ID!',
                        },
                        resolve: {
                            type: 'rest',
                            url: 'https://jsonplaceholder.typicode.com/users/{{id}}',
                        },
                    },
                    continents: {
                        type: '[Continent]',
                        resolve: {
                            type: 'graphql',
                            url: 'https://countries.trevorblades.com/',
                            query: '{ continents { code name }}',
                            grab: 'data.continents',
                        },
                    },
                    continent: {
                        type: 'Continent',
                        args: {
                            code: 'String!',
                        },
                        resolve: {
                            type: 'graphql',
                            url: 'https://countries.trevorblades.com/',
                            query: 'query foo ($code: String!) { continent (code: $code) { code name }}',
                            grab: 'data.continent',
                        },
                    },
                },
                shouldRunQueries: true,
            })

            const schema = new GraphQLSchema({
                query: new GraphQLObjectType({
                    name: 'RootQuery',
                    fields: { ...queries },
                }),
            })

            const query = `{
                MyExtension {
                    user (id: 8) { id name }
                    continent (code: "EU") { name }
                    users { id name }
                    continents { code name }
                }
            }`

            const r1 = await graphql(schema, query)
            console.log(r1.data.MyExtension)
        })
    })
})
