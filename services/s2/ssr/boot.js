import { createHookApp } from '@forrestjs/hooks'
import { registerExtensionJSON, validateExtensionHeader } from './register-extension'

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

        // setConfig('service.url', 'https://grapis2.ngrok.io')
        setConfig('service.url', 'http://localhost:7070')
        setConfig('service.name', 'Service2')

        setConfig('api.endpoint', 'http://localhost:8080/api')
        setConfig('api.token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiU2VydmljZTIiLCJpYXQiOjE1NjU2MTIyMDQsImV4cCI6MzMwOTE2NTQ2MDR9.p6K8_pS3UygrUgcjOBuMx0glyFysx4miTGfLd7y-wS4') // eslint-disable-line
    },
    services: [
        require('@forrestjs/service-env'),
        require('@forrestjs/service-express'),
    ],
    features: [
        // User's Routes
        [
            '$EXPRESS_ROUTE',
            ({ registerRoute }) => {
                registerRoute.get('/users/:id', [
                    // validateExtensionHeader(),
                    (req, res) => res.json(users.find(u => u.id === req.params.id)),
                ])
            },
        ],

        // Register the extension
        [
            '$START_SERVICE',
            async ({ getConfig }, { jwt }) => {
                registerExtensionJSON({
                    endpoint: getConfig('api.endpoint'),
                    token: getConfig('api.token'),
                    definition: {
                        name: 'Service2',
                        shouldRunQueries: true,
                        queries: {
                            age: {
                                type: 'Int',
                                args: { id: 'String!' },
                                resolve: {
                                    type: 'rest',
                                    url: `${getConfig('service.url')}/users/{{id}}`,
                                    grab: 'age',
                                    headers: {
                                        'x-grapi-signature': '{{ __meta.signature }}',
                                        'x-origin': 's2[origin] - {{ __meta.origin }}',
                                    },
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
