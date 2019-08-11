import { createHookApp } from '@forrestjs/hooks'
import { registerExtensionJSON } from './lib/register-extension'

require('es6-promise').polyfill()
require('isomorphic-fetch')

const users = [
    { id: 'dv', age: 74 },
    { id: 'ls', age: 55 },
]

// const verifyJWT = (token, customSecret) =>
//     new Promise((resolve, reject) => {
//         resolve({ ok: true })
//         // require('jsonwebtoken').verify(token, customSecret, (err, data) => {
//         //     if (err) {
//         //         reject(err)
//         //     } else {
//         //         resolve(data)
//         //     }
//         // })
//     })

// const verifyJWT = (token, secret) => {
//     return new Promise((resolve) => {
//         console.log('resolve', token, secret)
//         // resolve('ok')
//         setTimeout(() => resolve('ok'))
//     })
// }

export default createHookApp({
    // trace: true,
    settings: ({ setConfig }) => {
        setConfig('express.port', 7070)

        // setConfig('service.url', 'https://grapis2.ngrok.io')
        setConfig('service.url', 'http://localhost:7070')
        setConfig('service.name', 'Service2')

        setConfig('api.endpoint', 'http://localhost:8080/api')
        setConfig('jwt.secret', 'dwedewdew')
        setConfig('jwt.duration', '100y')
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
                const checkDynamicHeader = (req, res, next) => {
                    const token = req.headers['x-dynamic']
                    const secret = getConfig('jwt.secret')
                    require('jsonwebtoken').verify(token, secret, (err, data) => {
                        if (err) {
                            res.statusMessage = 'Dynamic check failed'
                            res.status(400).end()
                        } else {
                            next()
                        }
                    })
                    // verifyJWT(req.headers['x-dynamic'])
                    //     .then(() => next())
                    //     .catch(() => {
                    //         res.statusMessage = 'Dynamic check failed'
                    //         res.status(400).end()
                    //     })

                    // const foo = new Promise((resolve) => {
                    //     resolve()
                    // })

                    // foo.then(() => {
                    //     console.log('then!', next)
                    //     // next()
                    // })

                    // next()

                    // foo.catch(err => console.log(err))
                    // console.log(foo)
                    // next()
                }

                registerRoute.get('/users/:id', [
                    checkDynamicHeader,
                    (req, res) => {
                        res.json(users.find(u => u.id === req.params.id))
                    },
                ])
            },
        ],

        // Register the extension
        [
            '$START_SERVICE',
            async ({ getConfig }, { jwt }) => {
                registerExtensionJSON({
                    target: getConfig('api.endpoint'),
                    token: await jwt.sign(getConfig('service.name')),
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
                                        'x-dynamic': '{{ __meta.token }}',
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
