import { createHookApp } from '@forrestjs/hooks'
import { registerExtensionJSON } from './lib/register-extension'

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
        setConfig('api.endpoint', 'http://localhost:8080/api')
        setConfig('api.token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiU2VydmljZTIiLCJpYXQiOjE1NjUyNjc4NzQsImV4cCI6NTMwOTEzMTAyNzR9.oeyoG4MD-moNwNgY6KrF9tA9qyWSbS7_qEhqi-qabPU')
        setConfig('reverseUrl', 'http://localhost:7070')
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
                        name: 'Service2',
                        shouldRunQueries: true,
                        queries: {
                            age: {
                                type: 'Int',
                                args: { id: 'String!' },
                                resolve: {
                                    type: 'rest',
                                    url: `${getConfig('reverseUrl')}/users/{{id}}`,
                                    grab: 'age',
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
