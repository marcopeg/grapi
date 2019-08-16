import { createHookApp } from '@forrestjs/hooks'
import { validateStaticHeader } from './static-header'
import createExtension from './create-extension'

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
        setConfig('service.url', 'http://localhost:6060')
        setConfig('service.name', 'S1')

        setConfig('api.endpoint', 'http://localhost:8080/api')
        setConfig('api.token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImV4dGVuc2lvbiI6IlMxIn0sImlhdCI6MTU2NTcwMzAyNiwiZXhwIjozMzA5MTc0NTQyNn0.MIJEI5tgKgyXthBUmRrRTHT8FWRygqGMTVYRy7AeiP4') // eslint-disable-line

        setConfig('staticSignature', '123')

        setContext('extension', createExtension({
            name: getConfig('service.name'),
            endpoint: getConfig('api.endpoint'),
            token: getConfig('api.token'),
            variables: {
                serviceUrl: getConfig('service.url'),
                staticSignature: getConfig('staticSignature'),
            },
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
                    (req, res) => res.json(users.find(u => u.id === req.params.id)),
                ])

                registerRoute.get('/users', [
                    validateStaticHeader(getConfig('staticSignature')),
                    getContext('extension').createMiddleware(),
                    (req, res) => res.json(users),
                ])
            },
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
