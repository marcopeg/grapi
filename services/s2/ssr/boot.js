import { createHookApp } from '@forrestjs/hooks'
import { GraphQLInt, GraphQLID, GraphQLNonNull, GraphQLObjectType } from 'graphql'
import createExtension from './create-extension'

require('es6-promise').polyfill()
require('isomorphic-fetch')

const users = [
    { id: 'dv', age: 74 },
    { id: 'ls', age: 55 },
]

export default createHookApp({
    // trace: true,
    settings: ({ setConfig, getConfig }) => {
        setConfig('express.port', 7070)

        setConfig('service.url', 'http://localhost:7070')
        setConfig('service.name', 'S2')

        setConfig('api.endpoint', 'http://localhost:8080/api')
        setConfig('api.token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImV4dGVuc2lvbiI6IlMyIn0sIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUxNjIzOTAyMn0.XlcAlTdLGfT6DhDyhY1fVY6br3oXt_0iaid3S6WuZE0') // eslint-disable-line

        setConfig('extension', createExtension({
            name: getConfig('service.name'),
            endpoint: getConfig('api.endpoint'),
            token: getConfig('api.token'),
            variables: {
                serviceUrl: getConfig('service.url'),
            },
        }))
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
            ({ registerQuery }, { getConfig }) => {
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
                        // getConfig('extension').validateRequest(req)
                        return users.find(u => u.id === args.id)
                    },
                })
            },
        ],

        // Register the extension
        [
            '$START_SERVICE',
            async ({ getConfig }, { jwt }) => {
                // registerExtension({
                //     endpoint: getConfig('api.endpoint'),
                //     token: getConfig('api.token'),
                //     definition: {
                //         name: getConfig('service.name'),
                //         queries: [
                //             {
                //                 name: 'age',
                //                 type: 'Int!',
                //                 args: [
                //                     { name: 'xGrapiOrigin', type: 'String' },
                //                     { name: 'id', type: 'ID!' },
                //                 ],
                //                 resolve: {
                //                     type: 'graphql',
                //                     url: `${getConfig('service.url')}/api`,
                //                     query: 'query foo ($id: ID!) { user (id: $id) { age }}',
                //                     variables: {
                //                         id: '{{ ags.id }}',
                //                     },
                //                     headers: [
                //                         { name: 'x-grapi-origin', value: '{{ meta.origin }}' },
                //                         { name: 'x-grapi-signature', value: '{{ meta.signature }}' },
                //                     ],
                //                     grab: 'data.user.age',
                //                 },
                //             },
                //         ],
                //         rules: [
                //             { name: 'originNotNull' },
                //         ],
                //     },
                // })
                getConfig('extension').register()
                    .then(() => console.log('Extension successfully registered'))
                    .catch(err => console.log(`Failed to register the extension - ${err.message}`))
            },
        ],
    ],
})
