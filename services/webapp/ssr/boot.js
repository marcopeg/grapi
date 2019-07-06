import { createHookApp } from '@forrestjs/hooks'

require('es6-promise').polyfill()
require('isomorphic-fetch')

export default createHookApp({
    trace: true,
    settings: ({ setConfig, getEnv }) => {
        setConfig('postgres', [{
            host: getEnv('PG_HOST'),
            port: getEnv('PG_PORT'),
            database: getEnv('PG_DATABASE'),
            username: getEnv('PG_USERNAME'),
            password: getEnv('PG_PASSWORD'),
            maxAttempts: Number(getEnv('PG_MAX_CONN_ATTEMPTS', 25)),
            attemptDelay: Number(getEnv('PG_CONN_ATTEMPTS_DELAY', 5000)),
            models: [],
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
    },
    services: [
        require('@forrestjs/service-env'),
        require('@forrestjs/service-logger'),
        require('@forrestjs/service-jwt'),
        require('@forrestjs/service-hash'),
        // require('@forrestjs/service-postgres'),
        // require('@forrestjs/service-postgres-pubsub'),
        require('@forrestjs/service-express'),
        require('@forrestjs/service-express-cookies'),
        require('@forrestjs/service-express-graphql'),
        require('./services/service-request-id'),
        require('./services/service-device-id'),
        // require('@forrestjs/service-express-graphql-test'),
        // require('./services/service-express-graphql-extension'),
        // require('@forrestjs/service-express-ssr'),
        // require('@forrestjs/feature-locale'),
    ],
    features: [
        // require('./services/feature-session'),
        // require('./services/feature-session-info'),
        // require('./services/feature-auth'),
        // require('./services/feature-auth'),
        // require('./features/graphql-extensions-manager'),
        // require('./features/graphql-namespace-manager'),
    ],
})
