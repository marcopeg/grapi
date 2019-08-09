import { createHookApp } from '@forrestjs/hooks'
import { registerExtensionJSON } from './lib/register-extension'

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
        setConfig('api.endpoint', 'http://localhost:8080/api')
        setConfig('api.token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiU2VydmljZTEiLCJpYXQiOjE1NjUyNjc4NzQsImV4cCI6NTMwOTEzMTAyNzR9.CgfOlV4X6Xy0shoPiepW6cU3JwxQe1_sfDgRXVFFc_I')
        setConfig('reverseUrl', 'http://localhost:6060')
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
                registerRoute.get('/users/:id', async (req, res) => {
                    res.json(users.find(u => u.id === req.params.id))
                })

                registerRoute.get('/users', async (req, res) => {
                    res.json(users)
                })
            },
        ],

        // Register the extension
        [
            '$START_SERVICE',
            ({ getConfig }) => {
                registerExtensionJSON({
                    target: getConfig('api.endpoint'),
                    token: getConfig('api.token'),
                    definition: {
                        name: 'Service1',
                        shouldRunQueries: true,
                        queries: {
                            users: {
                                type: 'JSON',
                                resolve: {
                                    type: 'rest',
                                    url: `${getConfig('reverseUrl')}/users`,
                                },
                            },
                            user: {
                                type: 'JSON',
                                args: { id: 'String!' },
                                resolve: {
                                    type: 'rest',
                                    url: `${getConfig('reverseUrl')}/users/{{id}}`,
                                },
                            },
                            name: {
                                type: 'String!',
                                args: { id: 'String!' },
                                resolve: {
                                    type: 'rest',
                                    url: `${getConfig('reverseUrl')}/users/{{id}}`,
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
