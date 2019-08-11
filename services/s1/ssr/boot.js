import { createHookApp } from '@forrestjs/hooks'
import { registerExtensionJSON } from './lib/register-extension'

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
        setConfig('jwt.secret', 'wedewkldsacndaslkfdnsal')
        setConfig('jwt.duration', '100y')

        setConfig('staticCheck', '123')
    },
    services: [
        require('@forrestjs/service-env'),
        require('@forrestjs/service-jwt'),
        require('@forrestjs/service-express'),
    ],
    features: [
        // User's Routes
        [
            '$EXPRESS_ROUTE',
            ({ registerRoute }, { getConfig, jwt }) => {
                const checkStaticHeader = (req, res, next) => {
                    if (req.headers['x-static'] === getConfig('staticCheck')) {
                        next()
                        return
                    }

                    res.statusMessage = 'Static check failed'
                    res.status(400).end()
                }

                const checkDynamicHeader = (req, res, next) => {
                    require('jsonwebtoken').verify(req.headers['x-dynamic'], getConfig('jwt.secret'), (err, rrr) => {
                        if (err) {
                            res.statusMessage = 'Dynamic check failed'
                            res.status(400).end()
                        } else {
                            next()
                        }
                    })
                }

                registerRoute.get('/users/:id', [
                    checkStaticHeader,
                    checkDynamicHeader,
                    async (req, res) => {
                        res.json(users.find(u => u.id === req.params.id))
                    },
                ])

                registerRoute.get('/users', [
                    checkStaticHeader,
                    checkDynamicHeader,
                    (req, res) => res.json(users),
                ])
            },
        ],

        // Register the extension at boot time
        [
            '$START_SERVICE',
            async ({ getConfig }, { jwt }) => {
                registerExtensionJSON({
                    target: getConfig('api.endpoint'),
                    token: await jwt.sign(getConfig('service.name')),
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
                                        'x-static': getConfig('staticCheck'),
                                        'x-dynamic': '{{ __meta.token }}',
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
                                        'x-static': getConfig('staticCheck'),
                                        'x-dynamic': '{{ __meta.token }}',
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
