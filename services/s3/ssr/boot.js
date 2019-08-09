import { createHookApp } from '@forrestjs/hooks'
import { runQuery } from './lib/query'

require('es6-promise').polyfill()
require('isomorphic-fetch')

export default createHookApp({
    // trace: true,
    settings: ({ setConfig }) => {
        setConfig('express.port', 5050)
        setConfig('api.endpoint', 'http://localhost:8080/api')
        setConfig('api.token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiU2VydmljZTMiLCJpYXQiOjE1NjUyNjc4NzQsImV4cCI6NTMwOTEzMTAyNzR9.bV-98uUrNxMQ-CuPqmmNXq72yuDO9sRP7DKXuo6sv6c')
    },
    services: [
        require('@forrestjs/service-env'),
        require('@forrestjs/service-express'),
    ],
    features: [
        [
            '$EXPRESS_ROUTE',
            ({ registerRoute }, { getConfig }) => {
                // Aggregate a single user's data
                registerRoute.get('/u/:userId', async (req, res) => {
                    try {
                        const query = await runQuery({
                            target: getConfig('api.endpoint'),
                            query: `query foo ($userId: String!) {
                                Service1 { name (id: $userId) }
                                Service2 { age (id: $userId) }
                            }`,
                            variables: { userId: req.params.userId },
                            headers: { 'x-grapi-origin': getConfig('api.token') },
                        })

                        const html = [
                            `<h2>${query.data.Service1.name}</h2>`,
                            `<p>age: ${query.data.Service2.age}</p>`,
                            `<a href="/">Back</a>`,
                        ].join('')

                        res.send(html)
                    } catch (err) {
                        res.send(err.message)
                    }
                })

                // List users
                registerRoute.get('/', async (req, res) => {
                    try {
                        const query = await runQuery({
                            target: getConfig('api.endpoint'),
                            query: `query foo { Service1 { users }}`,
                            headers: { 'x-grapi-origin': getConfig('api.token') },
                        })

                        const html = query.data.Service1.users
                            .map(user => `<li><a href="/u/${user.id}">${user.name}</a></li>`)
                            .join('')

                        res.send(html)
                    } catch (err) {
                        res.send(err.message)
                    }
                })
            },
        ],
    ],
})
