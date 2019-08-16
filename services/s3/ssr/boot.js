import { createHookApp } from '@forrestjs/hooks'
import { runQuery } from './lib/query'

require('es6-promise').polyfill()
require('isomorphic-fetch')

export default createHookApp({
    // trace: true,
    settings: ({ setConfig }) => {
        setConfig('express.port', 5050)
        setConfig('api.endpoint', 'http://localhost:8080/api')
        setConfig('api.token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImV4dGVuc2lvbiI6IlRyZXZvcmJsYWRlcyJ9LCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.n7C0HplzzKC7ZE4gyv6hQDiJj-7Ew3M5pGyQqQR0Mig') // eslint-disable-line
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
                            query: `query foo ($userId: ID!) {
                                S1 { name (id: $userId) }
                                S2 { age (id: $userId) }
                            }`,
                            variables: { userId: req.params.userId },
                            headers: { 'x-grapi-origin': getConfig('api.token') },
                        })

                        const html = [
                            `<h2>${query.data.S1.name}</h2>`,
                            `<p>age: ${query.data.S2.age}</p>`,
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
                            query: `query foo { S1 { users }}`,
                            headers: { 'x-grapi-origin': getConfig('api.token') },
                        })

                        const html = query.data.S1.users
                            .map(user => `<li><a href="/u/${user.id}">${user.name}</a></li>`)
                            .join('')

                        res.send(html)
                    } catch (err) {
                        res.send(err.message)
                    }
                })

                // Mysocial Extension
                // registerRoute.get('/mysocial', async (req, res) => {
                //     try {
                //         const snap = (await runQuery({
                //             target: getConfig('api.endpoint'),
                //             query: `query foo ( $token: String! ) {
                //                 Mysocial { snap ( token: $token ) }
                //             }`,
                //             variables: req.query,
                //             headers: { 'x-grapi-origin': getConfig('api.token') },
                //         })).data.Mysocial.snap

                //         const channels = snap.channels
                //             .filter(channel => channel.vendor === 'instagram')
                //             .map((channel, idx) => `f${idx}: ig ( id: "${channel.vendorId}")`)
                //             .join(' ')

                //         const igd = (await runQuery({
                //             target: getConfig('api.endpoint'),
                //             query: `query foo { Mysocial { ${channels} } }`,
                //             variables: req.query,
                //             headers: { 'x-grapi-origin': getConfig('api.token') },
                //         })).data.Mysocial

                //         res.send({
                //             uname: snap.username,
                //             channels,
                //             igd,
                //         })
                //         // const html = query.data.Service1.users
                //         //     .map(user => `<li><a href="/u/${user.id}">${user.name}</a></li>`)
                //         //     .join('')

                //         // res.send(html)
                //     } catch (err) {
                //         res.send(err.message)
                //     }
                // })
            },
        ],
    ],
})
