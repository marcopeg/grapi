import { createHookApp } from '@forrestjs/hooks'
import { registerExtension, validateRequest } from './register-extension'
import { validateStaticHeader } from './static-header'

require('es6-promise').polyfill()
require('isomorphic-fetch')

const users = [
    { id: 'dv', name: 'Darth Vader' },
    { id: 'ls', name: 'Luke Skywalker' },
]

export default createHookApp({
    // trace: true,
    settings: ({ setConfig }) => {
        // setConfig('express.port', 6060)
        // setConfig('service.url', 'http://localhost:6060')
        // setConfig('service.name', 'Service1')

        // setConfig('api.endpoint', 'http://localhost:8080/api')
        // setConfig('api.token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiU2VydmljZTEiLCJpYXQiOjE1NjU2MTIyMDQsImV4cCI6MzMwOTE2NTQ2MDR9.MpwI6c9WaK4Hu1XZPXoaKKx-24aRMnkG3lomiim_cxQ') // eslint-disable-line

        // setConfig('staticSignature', '123')
    },
    services: [
        // require('@forrestjs/service-env'),
        // require('@forrestjs/service-express'),
    ],
    features: [
        // User's Routes
        // [
        //     '$EXPRESS_ROUTE',
        //     ({ registerRoute }, { getConfig, jwt }) => {
        //         registerRoute.get('/users/:id', [
        //             // validateStaticHeader(getConfig('staticSignature')),
        //             validateRequest(),
        //             (req, res) => res.json(users.find(u => u.id === req.params.id)),
        //         ])

        //         registerRoute.get('/users', [
        //             validateStaticHeader(getConfig('staticSignature')),
        //             validateRequest(),
        //             (req, res, next) => {
        //                 console.log(req.headers['x-grapi-origin'])
        //                 next()
        //             },
        //             (req, res) => res.json(users),
        //         ])
        //     },
        // ],

        // Register the extension at boot time
        [
            '$START_SERVICE',
            async ({ getConfig }, { jwt }) => {
                registerExtension({
                    secret: '123',
                    endpoint: 'http://localhost:8080/api',
                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiTXlzb2NpYWwiLCJpYXQiOjE1MTYyMzkwMjJ9.t9_QAWseGDfq7OgQcADoomQxM2FxhWe6t_NiErmEhvc',
                    definition: {
                        name: 'Mysocial',
                        shouldRunQueries: true,
                        queries: {
                            snap: {
                                type: 'JSON',
                                args: { token: 'String!' },
                                resolve: {
                                    type: 'graphql',
                                    url: 'https://mysocial.ngrok.io/api/graphql',
                                    query: `query foo { misc { myUserInfo ( token: "{{ token }}") }}`,
                                    grab: 'data.misc.myUserInfo',
                                },
                            },
                            ig: {
                                type: 'JSON',
                                args: { id: 'ID!' },
                                resolve: {
                                    type: 'rest',
                                    url: 'https://mysocial2.ngrok.io/ig_profile/{{ id }}',
                                    headers: {
                                        'x-grapi-signature': '{{ __meta.signature }}',
                                    },
                                },
                            },
                        },
                    },
                    // GRAPI Routing rules
                    // this doesn't really protect the service
                    rules: [
                        // { name: 'originNotNull' },
                        // { name: 'originWhiteList', accept: [ 'Service2', 'Service3' ] },
                    ],
                })
                    .then(() => console.log('Extension successfully registered'))
                    .catch(err => console.log(`Failed to register the extension - ${err.message}`))
            },
        ],
    ],
})
