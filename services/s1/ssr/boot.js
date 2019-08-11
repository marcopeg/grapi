import { createHookApp } from '@forrestjs/hooks'
import { registerExtensionJSON, validateExtensionHeader } from './register-extension'
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
        // setConfig('service.url', 'https://grapis1.ngrok.io')
        setConfig('service.url', 'http://localhost:6060')
        setConfig('service.name', 'Service1')

        setConfig('api.endpoint', 'http://localhost:8080/api')
        setConfig('api.token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiU2VydmljZTEiLCJpYXQiOjE1NjUzNTM3ODMsImV4cCI6MzMwOTEzOTYxODN9.aUA37x-CgyEjV1m06N3O1G0UZz_4fhH6wIORViua3pY') // eslint-disable-line

        setConfig('staticSignature', '123')
    },
    services: [
        require('@forrestjs/service-env'),
        require('@forrestjs/service-express'),
    ],
    features: [
        // User's Routes
        [
            '$EXPRESS_ROUTE',
            ({ registerRoute }, { getConfig, jwt }) => {
                registerRoute.get('/users/:id', [
                    validateStaticHeader(getConfig('staticSignature')),
                    validateExtensionHeader(),
                    async (req, res) => {
                        res.json(users.find(u => u.id === req.params.id))
                    },
                ])

                registerRoute.get('/users', [
                    validateStaticHeader(getConfig('staticSignature')),
                    validateExtensionHeader(),
                    (req, res) => res.json(users),
                ])
            },
        ],

        // Register the extension at boot time
        [
            '$START_SERVICE',
            async ({ getConfig }, { jwt }) => {
                registerExtensionJSON({
                    endpoint: getConfig('api.endpoint'),
                    token: getConfig('api.token'),
                    definition: {
                        name: getConfig('service.name'),
                        shouldRunQueries: true,
                        queries: {
                            users: {
                                type: 'JSON',
                                resolve: {
                                    type: 'rest',
                                    url: `${getConfig('service.url')}/users`,
                                    headers: {
                                        'x-static-signature': getConfig('staticSignature'),
                                        'x-grapi-signature': '{{ __meta.signature }}',
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
                    rules: [
                        { name: 'originNotNull' },
                    ],
                })
                    .then(() => console.log('Extension successfully registered'))
                    .catch(err => console.log(`Failed to register the extension - ${err.message}`))
            },
        ],
    ],
})
