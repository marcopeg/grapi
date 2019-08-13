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
        setConfig('express.port', 6060)
        setConfig('service.url', 'http://localhost:6060')
        setConfig('service.name', 'Service1')

        setConfig('api.endpoint', 'http://localhost:8080/api')
        setConfig('api.token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiU2VydmljZTEiLCJpYXQiOjE1NjU2MTIyMDQsImV4cCI6MzMwOTE2NTQ2MDR9.MpwI6c9WaK4Hu1XZPXoaKKx-24aRMnkG3lomiim_cxQ') // eslint-disable-line

        setConfig('staticSignature', '123')
    },
    services: [
        // require('@forrestjs/service-env'),
        require('@forrestjs/service-express'),
    ],
    features: [
        // User's Routes
        [
            '$EXPRESS_ROUTE',
            ({ registerRoute }, { getConfig, jwt }) => {
                registerRoute.get('/users/:id', [
                    // validateStaticHeader(getConfig('staticSignature')),
                    validateRequest(),
                    (req, res) => res.json(users.find(u => u.id === req.params.id)),
                ])

                registerRoute.get('/users', [
                    validateStaticHeader(getConfig('staticSignature')),
                    validateRequest(),
                    (req, res, next) => {
                        console.log(req.headers['x-grapi-origin'])
                        next()
                    },
                    (req, res) => res.json(users),
                ])
            },
        ],

        // Register the extension at boot time
        [
            '$START_SERVICE',
            async ({ getConfig }, { jwt }) => {
                registerExtension({
                    endpoint: getConfig('api.endpoint'),
                    token: getConfig('api.token'),
                    definition: {
                        name: getConfig('service.name'),
                        shouldRunQueries: true,
                        queries: {
                            users: {
                                type: 'JSON',
                                // args: {
                                //     xGrapiOrigin: 'String',
                                // },
                                resolve: {
                                    type: 'rest',
                                    url: `${getConfig('service.url')}/users`,
                                    headers: {
                                        'x-static-signature': getConfig('staticSignature'),
                                        'x-grapi-signature': '{{ __meta.signature }}',
                                        'x-grapi-origin': '{{ __meta.origin }}',
                                    },
                                },
                            },
                            name: {
                                type: 'String!',
                                args: { id: 'String!' },
                                resolve: {
                                    type: 'rest',
                                    url: `${getConfig('service.url')}/users/{{id}}`,
                                    headers: {
                                        'x-static-signature': getConfig('staticSignature'),
                                        'x-grapi-signature': '{{ __meta.signature }}',
                                    },
                                    grab: 'name',
                                },
                            },
                        },
                    },
                    // GRAPI Routing rules
                    // this doesn't really protect the service
                    rules: [
                        { name: 'originNotNull' },
                        { name: 'originWhiteList', accept: [ 'Service2', 'Service3' ] },
                    ],
                })
                    .then(() => console.log('Extension successfully registered'))
                    .catch(err => console.log(`Failed to register the extension - ${err.message}`))
            },
        ],
    ],
})
