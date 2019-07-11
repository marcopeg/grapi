import { createHookApp } from '@forrestjs/hooks'

require('es6-promise').polyfill()
require('isomorphic-fetch')

export default createHookApp({
    trace: true,
    settings: ({ setConfig, getEnv }) => {
        setConfig('postgres.connections', [{
            host: getEnv('PG_HOST'),
            port: getEnv('PG_PORT'),
            database: getEnv('PG_DATABASE'),
            username: getEnv('PG_USERNAME'),
            password: getEnv('PG_PASSWORD'),
            maxAttempts: Number(getEnv('PG_MAX_CONN_ATTEMPTS', 25)),
            attemptDelay: Number(getEnv('PG_CONN_ATTEMPTS_DELAY', 5000)),
            models: [],
            // onConnection: async (conn) => {
            //     await conn.handler.query('drop schema public cascade;')
            //     await conn.handler.query('create schema public;')
            // },
        }])

        setConfig('postgresPubSub', [{
            host: getEnv('PG_HOST'),
            port: getEnv('PG_PORT'),
            database: getEnv('PG_DATABASE'),
            username: getEnv('PG_USERNAME'),
            password: getEnv('PG_PASSWORD'),
        }])

        // setConfig('expressGraphqlTest', {

        // })

        // settings.express = {
        //     graphql: {
        //         testIsEnabled: true,
        //         testIsValid: (token, req) => (token === 'xxx'),
        //     },
        //     session: {
        //         initialize: true,
        //     },
        // }

        // settings.graphqlExtension = {
        //     // sourcePath: 'foo',
        // }

        setConfig('jwt', {
            secret: getEnv('JWT_SECRET'),
            duration: getEnv('JWT_DURATION'),
        })

        setConfig('hash', {
            rounds: Number(getEnv('BCRYPT_ROUNDS')),
        })

        // setConfig('express.session.autoStart', false)
        // setConfig('express.session.autoExtend', false)
        // setConfig('express.session.duration', '5s')
        setConfig('express.device.setCookie', false)
        // setConfig('express.session.setCookie', false)
        // setConfig('express.session.setHeader', true)
        // setConfig('express.session.autoValidate', true)
    },
    services: [
        require('@forrestjs/service-env'),
        require('@forrestjs/service-logger'),
        require('@forrestjs/service-jwt'),
        require('@forrestjs/service-hash'),
        require('@forrestjs/service-postgres'),
        require('@forrestjs/service-postgres-pubsub'),
        require('@forrestjs/service-express'),
        require('@forrestjs/service-express-cookies'),
        require('@forrestjs/service-express-graphql'),
        require('./services/service-express-request'),
        require('./services/service-express-device'),
        require('./services/service-express-session'),
        require('@forrestjs/service-express-graphql-test'),
        // require('./services/service-express-graphql-extension'),
        // require('@forrestjs/service-express-ssr'),
        // require('@forrestjs/feature-locale'),
    ],
    features: [
        require('./features/feature-pg-session'),
        require('./features/feature-pg-auth'),
        // require('./services/feature-session-info'),
        // require('./services/feature-auth'),
        // require('./services/feature-auth'),
        // require('./features/graphql-extensions-manager'),
        // require('./features/graphql-namespace-manager'),
        // [ '$EXPRESS_ROUTE', ({ registerRoute }) => {
        //     registerRoute.get('/', async (req, res) => {
        //         try {
        //             // console.log(req.session)
        //             // !req.session.id && await res.session.start()
        //             // console.log(Object.keys(req.hooks))
        //             await req.session.validate()
        //             await req.session.set({ a: 1, b: 'ma' })
        //             // await req.session.set({ foo: 23, a: 'Marco' })
        //             // console.log('SESSION', await req.session.get())
        //             res.send(`Hello ${req.id} / ${req.session.id}`)
        //         } catch (err) {
        //             res.send(err.message)
        //         }
        //     })
        // } ],

        // Inject some session stuff
        // [ '$EXPRESS_SESSION_GRAPHQL', ({ registerQuery, registerMutation }) => {
        //     registerQuery('foo', {
        //         description: 'Add Foo',
        //         type: require('graphql').GraphQLString,
        //         resolve: () => 'Fooo',
        //     })
        //     registerMutation('data', {
        //         type: require('graphql-type-json').default,
        //         resolve: (params) => params.data,
        //     })
        // } ],
    ],
})
