import { createHookApp } from '@forrestjs/hooks'
import path from 'path'

require('es6-promise').polyfill()
require('isomorphic-fetch')

export default createHookApp({
    // trace: true,
    settings: ({ setConfig, getEnv }) => {
        setConfig('postgres.connections', [{
            host: getEnv('PG_HOST'),
            port: getEnv('PG_PORT'),
            database: getEnv('PG_DATABASE'),
            username: getEnv('PG_USERNAME'),
            password: getEnv('PG_PASSWORD'),
            maxAttempts: Number(getEnv('PG_MAX_CONN_ATTEMPTS', 25)),
            attemptDelay: Number(getEnv('PG_CONN_ATTEMPTS_DELAY', 5000)),
            pool: { max: 2, min: 0, acquire: 30000, idle: 10000 },
            models: [],
            onConnection: async (conn) => {
                // await conn.handler.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;')
                // await conn.handler.query('drop schema public cascade;')
                // await conn.handler.query('create schema public;')
                // await conn.handler.query('drop table if exists graphql_extensions_registry;')
                // await conn.handler.query('drop table if exists graphql_extensions_tokens;')
            },
        }])

        setConfig('postgresPubSub', [{
            host: getEnv('PG_HOST'),
            port: getEnv('PG_PORT'),
            database: getEnv('PG_DATABASE'),
            username: getEnv('PG_USERNAME'),
            password: getEnv('PG_PASSWORD'),
        }])

        // setConfig('expressGraphqlTest.isValid', ({ token }) => token === 'ali')

        // settings.graphqlExtension = {
        //     // sourcePath: 'foo',
        // }

        setConfig('jwt', {
            secret: getEnv('JWT_SECRET'),
            duration: getEnv('JWT_DURATION'),
        })

        setConfig('express.session.duration', '30d')

        setConfig('expressSSR.enabled', 'no')

        setConfig('graphqlExtension.sourcePath', path.join(process.cwd(), 'extensions'))

        // console.log('>>> build', process.env.REACT_SSR_BUILD)
        // console.log('>>> src', process.env.REACT_SSR_BUILD_SRC)
        // setConfig('expressSSR.enabled', 'no')

        // setConfig('hash', {
        //     rounds: Number(getEnv('BCRYPT_ROUNDS')),
        // })

        // setConfig('express.session.autoStart', false)
        // setConfig('express.session.autoExtend', false)
        // setConfig('express.session.duration', '5s')
        // setConfig('express.device.setCookie', false)
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
        // In order to catch the graphql query
        // [ '$EXPRESS_MIDDLEWARE', ({ registerMiddleware }) => {
        //     registerMiddleware(require('body-parser').json())
        //     registerMiddleware(require('body-parser').urlencoded({ extended: true }))
        // } ],
        require('@forrestjs/service-express-cookies'),
        require('@forrestjs/service-express-graphql'),
        require('./services/service-express-request'),
        require('./services/service-express-device'),
        require('./services/service-express-session'),
        require('@forrestjs/service-express-graphql-test'),
        require('./services/service-express-graphql-extension'),
        require('@forrestjs/service-express-ssr'),
        require('@forrestjs/feature-locale'),
    ],
    features: [
        require('./features/feature-pg-session'),
        require('./features/feature-pg-session-info'),
        // require('./features/feature-pg-session-history'),
        require('./features/feature-pg-auth'),
        require('./features/feature-passport'),
        require('./features/feature-journal'),

        // require('./services/feature-auth'),
        // require('./services/feature-auth'),
        require('./features/graphql-extensions-registry'),
        require('./features/graphql-extensions-manager'),
        require('./features/graphql-extensions-rules'),
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

        // [ '$PG_AUTH_GRAPHQL', ({ registerQuery }) => {
        //     registerQuery('origin', {
        //         type: require('graphql').GraphQLString,
        //         resolve: $ => $.payload.origin,
        //     })
        // } ],
        // [ '$PG_AUTH_GRAPHQL', ({ registerQuery }) => {
        //     registerQuery('etag', {
        //         type: require('graphql').GraphQLInt,
        //         resolve: $ => $.etag,
        //     })
        // } ],
        // [ '$PG_AUTH_GRAPHQL', ({ registerQuery }) => {
        //     registerQuery('uname', {
        //         type: require('graphql').GraphQLString,
        //         resolve: $ => $.uname,
        //     })
        // } ],
        // [ '$PG_AUTH_GRAPHQL', ({ registerQuery }) => {
        //     registerQuery('id', {
        //         type: require('graphql').GraphQLString,
        //         resolve: $ => $.id,
        //     })
        // } ],

        // [ '$EXPRESS_ROUTE', ({ registerRoute }) => {
        //     // registerRoute.get('/', async (req, res) => {
        //     //     await req.session.validate()
        //     //     const count = await req.session.read('count') || 0
        //     //     await req.session.write('count', parseInt(count, 10) + 1)
        //     //     res.send(`hello ${count}`)
        //     // })
        //     registerRoute.get('/hggh', (req, res) => {
        //         res.send('hellod ddewdewdew' + req.foooo)
        //     })
        // } ],


        // ({ registerAction }) => {
        //     registerAction({
        //         hook: '$EXPRESS_MIDDLEWARE',
        //         optional: true,
        //         handler: ({ registerMiddleware }) => {
        //             registerMiddleware((req, res, next) => {
        //                 req.foooo = 12345
        //                 next()
        //             })
        //         },
        //     })
        // },

        [
            '$EXPRESS_ROUTE',
            ({ registerRoute }) => registerRoute.get('/foo', (req, res) => {
                res.json({
                    basic: 'hoho',
                    ...req.headers,
                })
            }),
        ],
    ],
})
