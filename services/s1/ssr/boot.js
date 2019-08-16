import { createHookApp } from '@forrestjs/hooks'
import { validateStaticHeader } from './static-header'
import createExtension from './create-extension'
import { HttpError } from '@crossroad/client'

require('es6-promise').polyfill()
require('isomorphic-fetch')

const users = [
    { id: 'dv', name: 'Darth Vader' },
    { id: 'ls', name: 'Luke Skywalker' },
]

export default createHookApp({
    // trace: true,
    settings: ({ setConfig, getConfig, setContext }) => {
        setConfig('express.port', 6060)
        setConfig('staticSignature', '123')

        setContext('extension', createExtension({
            name: 'S1',
            endpoint: 'http://localhost:8080/api',
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImV4dGVuc2lvbiI6IlMxIn0sImlhdCI6MTU2NTcwMzAyNiwiZXhwIjozMzA5MTc0NTQyNn0.MIJEI5tgKgyXthBUmRrRTHT8FWRygqGMTVYRy7AeiP4', // eslint-disable-line
            variables: [
                { name: 'serviceUrl', value: 'http://localhost:6060' },
                { name: 'staticSignature', value: getConfig('staticSignature') },
            ],
        }))
    },
    services: [
        require('@forrestjs/service-express'),
    ],
    features: [
        // User's Routes
        [
            '$EXPRESS_ROUTE',
            ({ registerRoute }, { getConfig, getContext }) => {
                registerRoute.get('/users/:id', [
                    validateStaticHeader(getConfig('staticSignature')),
                    getContext('extension').createMiddleware(),
                    // () => HttpError.throw('Example Error', 418),
                    (req, res) => res.json(users.find(u => u.id === req.params.id)),
                ])

                registerRoute.get('/users', [
                    validateStaticHeader(getConfig('staticSignature')),
                    getContext('extension').createMiddleware(),
                    // () => HttpError.throw('Example Error', 418),
                    (req, res) => res.json(users),
                ])
            },
        ],

        // Handle App's throws and turn them into status codes with custom
        // statusMessage for a nice error propagation
        [
            '$EXPRESS_HANDLER',
            ({ registerHandler }) => registerHandler(HttpError.createHandler()),
        ],

        // Register the extension at boot time
        [
            '$START_SERVICE',
            async ({ getContext }) => {
                getContext('extension').register()
                    .then(() => {
                        console.log('Extension successfully registered')
                        // setInterval(() => getConfig('extension').rotateSecret(), 2500)
                    })
                    .catch(err => console.log(`Failed to register the extension - ${err.message}`))
            },
        ],
    ],
})
