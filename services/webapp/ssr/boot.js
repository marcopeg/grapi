import { createHookApp } from '@forrestjs/hooks'
import parseDatabaseUrl from 'parse-database-url'

require('es6-promise').polyfill()
require('isomorphic-fetch')

export default createHookApp({
    trace: true,
    settings: async ({ setConfig, getEnv }) => {
        // Compose the configuration from a single database URL or from single pieces of information
        // NOTE: usefull to handle Heroku's default configuration variables
        const databaseUrl = getEnv('DATABASE_URL', `postgres://${getEnv('PG_USERNAME')}:${getEnv('PG_PASSWORD')}@${getEnv('PG_HOST')}:${getEnv('PG_PORT')}/${getEnv('PG_DATABASE')}`)
        const databaseConfig = (() => {
            const config = parseDatabaseUrl(databaseUrl)
            config.username = config.user
            delete config.user
            delete config.driver
            return config
        })()

        setConfig('postgres.connections', [{
            ...databaseConfig,
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

        setConfig('jwt', {
            secret: getEnv('JWT_SECRET'),
            duration: getEnv('JWT_DURATION'),
        })

        setConfig('express.session.duration', '30d')
        setConfig('expressSSR.enabled', 'no')
    },
    services: [
        require('@forrestjs/service-env'),
        require('@forrestjs/service-logger'),
        require('@forrestjs/service-jwt'),
        require('@forrestjs/service-hash'),
        require('@forrestjs/service-postgres'),
        require('@forrestjs/service-postgres-pubsub'),
        require('@forrestjs/service-express'),
        require('@forrestjs/service-express-graphql'),
        require('@forrestjs/service-express-graphql-test'),
        require('@forrestjs/service-express-cookies'),
        require('@forrestjs/service-express-request'),
        require('@forrestjs/service-express-device'),
        require('@forrestjs/service-express-session'),

        require('@forrestjs/service-express-ssr'),
        require('@forrestjs/feature-locale'),
    ],
    features: [
        require('@forrestjs/feature-pg-session'),
        require('@forrestjs/feature-pg-session-info'),
        require('@forrestjs/feature-pg-auth'),
        require('./features/feature-passport'),
        require('./features/feature-journal'),
    ],
})
