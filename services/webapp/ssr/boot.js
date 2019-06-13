import { registerAction, SETTINGS, FINISH } from '@forrestjs/hooks'
import { createHookApp, logBoot } from '@forrestjs/hooks'
import * as config from '@marcopeg/utils/lib/config'

require('es6-promise').polyfill()
require('isomorphic-fetch')

registerAction({
    hook: SETTINGS,
    name: '♦ boot',
    handler: async ({ settings }) => {
        settings.postgres = [{
            host: config.get('PG_HOST'),
            port: config.get('PG_PORT'),
            database: config.get('PG_DATABASE'),
            username: config.get('PG_USERNAME'),
            password: config.get('PG_PASSWORD'),
            maxAttempts: Number(config.get('PG_MAX_CONN_ATTEMPTS', 25)),
            attemptDelay: Number(config.get('PG_CONN_ATTEMPTS_DELAY', 5000)),
            models: [],
        }]

        settings.postgresPubsub = [{
            host: config.get('PG_HOST'),
            port: config.get('PG_PORT'),
            database: config.get('PG_DATABASE'),
            username: config.get('PG_USERNAME'),
            password: config.get('PG_PASSWORD'),
        }]

        settings.express = {
            graphql: {
                testIsEnabled: true,
                testIsValid: (token, req) => (token === 'xxx'),
            },
            // ssr: {
            //     disableJs: 'yes',
            //     // multilanguage cache policy
            //     // shouldCache: (req) => (req.query.locale === undefined),
            //     // getCacheKey: (req) => ({ value: [ req.url, req.locale.language, req.locale.region ] }),
            // },
        }

        settings.graphqlExtension = {
            // sourcePath: 'foo',
        }

        settings.jwt = {
            secret: config.get('JWT_SECRET'),
            duration: config.get('JWT_DURATION'),
        }

        settings.hash = {
            rounds: Number(config.get('BCRYPT_ROUNDS')),
        }
    },
})

process.env.NODE_ENV === 'development' && registerAction({
    hook: FINISH,
    name: '♦ boot',
    handler: () => logBoot(),
})

export default createHookApp({
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
        require('./services/service-express-graphql-extension'),
        require('@forrestjs/service-express-ssr'),
        require('@forrestjs/feature-locale'),
    ],
    features: [
        require('./services/feature-auth'),
        require('./features/graphql-extensions-manager'),
        require('./features/graphql-namespace-manager'),
    ],
})
