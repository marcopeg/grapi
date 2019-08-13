import { createHookApp } from '@forrestjs/hooks'
import { registerExtension, createRequestValidator } from './register-extension'
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
        setConfig('service.name', 'S1')

        setConfig('api.endpoint', 'http://localhost:8080/api')
        setConfig('api.token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImV4dGVuc2lvbiI6IlMxIn0sImlhdCI6MTU2NTcwMzAyNiwiZXhwIjozMzA5MTc0NTQyNn0.MIJEI5tgKgyXthBUmRrRTHT8FWRygqGMTVYRy7AeiP4') // eslint-disable-line

        setConfig('staticSignature', '123')
    },
    services: [
        require('@forrestjs/service-express'),
    ],
    features: [
        // User's Routes
        [
            '$EXPRESS_ROUTE',
            ({ registerRoute }, { getConfig, jwt }) => {
                registerRoute.get('/users/:id', [
                    validateStaticHeader(getConfig('staticSignature')),
                    createRequestValidator(),
                    (req, res) => res.json(users.find(u => u.id === req.params.id)),
                ])

                registerRoute.get('/users', [
                    validateStaticHeader(getConfig('staticSignature')),
                    createRequestValidator(),
                    // (req, res, next) => {
                    //     console.log(req.headers['x-grapi-origin'])
                    //     console.log(req.headers['x-grapi-signature'])
                    //     next()
                    // },
                    (req, res) => res.json(users),
                ])
            },
        ],

        // Register the extension at boot time
        [
            '$START_SERVICE',
            async ({ getConfig }) => {
                registerExtension({
                    endpoint: getConfig('api.endpoint'),
                    token: getConfig('api.token'),
                    definition: {
                        name: getConfig('service.name'),
                        queries: [
                            {
                                name: 'users',
                                type: 'JSON',
                                args: [
                                    { name: 'xGrapiOrigin', type: 'String' },
                                ],
                                resolve: {
                                    type: 'rest',
                                    url: `${getConfig('service.url')}/users`,
                                    headers: [
                                        { name: 'x-grapi-origin', value: '{{ __meta.origin }}' },
                                        { name: 'x-grapi-signature', value: '{{ __meta.signature }}' },
                                        { name: 'x-static-signature', value: getConfig('staticSignature') },
                                    ],
                                },
                            },
                            {
                                name: 'name',
                                type: 'JSON',
                                args: [
                                    { name: 'xGrapiOrigin', type: 'String' },
                                    { name: 'id', type: 'ID!' },
                                ],
                                resolve: {
                                    type: 'rest',
                                    url: `${getConfig('service.url')}/users/{{ id }}`,
                                    headers: [
                                        { name: 'x-grapi-origin', value: '{{ __meta.origin }}' },
                                        { name: 'x-grapi-signature', value: '{{ __meta.signature }}' },
                                        { name: 'x-static-signature', value: getConfig('staticSignature') },
                                    ],
                                    grab: 'name',
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
