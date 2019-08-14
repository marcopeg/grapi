import { createHookApp } from '@forrestjs/hooks'
import { registerExtension, validateRequest } from './register-extension'
import { GraphQLInt, GraphQLID, GraphQLNonNull, GraphQLObjectType } from 'graphql'

require('es6-promise').polyfill()
require('isomorphic-fetch')

const users = [
    { id: 'dv', age: 74 },
    { id: 'ls', age: 55 },
]

export default createHookApp({
    // trace: true,
    settings: ({ setConfig }) => {
        setConfig('express.port', 7070)

        setConfig('service.url', 'http://localhost:7070')
        setConfig('service.name', 'S2')

        setConfig('api.endpoint', 'http://localhost:8080/api')
        setConfig('api.token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImV4dGVuc2lvbiI6IlMyIn0sImlhdCI6MTU2NTcwNTI0MiwiZXhwIjozMzA5MTc0NzY0Mn0.J6FGYgL5jAkBUPTnN62f0l9KZkgvpjJKcQL-Qb8cGXI') // eslint-disable-line
    },
    services: [
        require('@forrestjs/service-env'),
        require('@forrestjs/service-express'),
        require('@forrestjs/service-express-graphql'),
    ],
    features: [
        // Service's APIs
        [
            '$EXPRESS_GRAPHQL',
            ({ registerQuery }) => {
                registerQuery('user', {
                    args: {
                        id: { type: new GraphQLNonNull(GraphQLID) },
                    },
                    type: new GraphQLObjectType({
                        name: 'User',
                        fields: {
                            id: { type: new GraphQLNonNull(GraphQLID) },
                            age: { type: new GraphQLNonNull(GraphQLInt) },
                        },
                    }),
                    resolve: async (_, args, { req }) => {
                        await validateRequest(req)
                        return users.find(u => u.id === args.id)
                    },
                })
            },
        ],

        // Register the extension
        [
            '$START_SERVICE',
            async ({ getConfig }, { jwt }) => {
                registerExtension({
                    endpoint: getConfig('api.endpoint'),
                    token: getConfig('api.token'),
                    definition: {
                        name: getConfig('service.name'),
                        queries: [
                            {
                                name: 'age',
                                type: 'Int!',
                                args: [
                                    { name: 'xGrapiOrigin', type: 'String' },
                                    { name: 'id', type: 'ID!' },
                                ],
                                resolve: {
                                    type: 'graphql',
                                    url: `${getConfig('service.url')}/api`,
                                    query: 'query foo ($id: ID!) { user (id: $id) { age }}',
                                    variables: {
                                        id: '{{ ags.id }}',
                                    },
                                    headers: [
                                        { name: 'x-grapi-origin', value: '{{ meta.origin }}' },
                                        { name: 'x-grapi-signature', value: '{{ meta.signature }}' },
                                    ],
                                    grab: 'data.user.age',
                                },
                            },
                        ],
                        rules: [
                            { name: 'originNotNull' },
                        ],
                    },
                })
                    .then(() => console.log('Extension successfully registered'))
                    .catch(err => console.log(`Failed to register the extension - ${err.message}`))
            },
        ],
    ],
})
