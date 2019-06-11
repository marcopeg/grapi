import { registerAction, SETTINGS, FINISH } from '@forrestjs/hooks'
import { createHookApp, logBoot } from '@forrestjs/hooks'

require('es6-promise').polyfill()
require('isomorphic-fetch')

registerAction({
    hook: SETTINGS,
    name: '♦ boot',
    handler: async ({ settings }) => {
        settings.express = {
            graphql: {
                testIsEnabled: true,
                testIsValid: (token, req) => (token === 'xxx'),
            },
            ssr: {
                disableJs: 'yes',
                // multilanguage cache policy
                // shouldCache: (req) => (req.query.locale === undefined),
                // getCacheKey: (req) => ({ value: [ req.url, req.locale.language, req.locale.region ] }),
            },
        }

        settings.graphqlExtension = {
            // sourcePath: 'foo',
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
        require('@forrestjs/service-express'),
        require('@forrestjs/service-express-cookies'),
        require('@forrestjs/service-express-graphql'),
        require('./services/service-express-graphql-extension'),
        require('@forrestjs/service-express-ssr'),
        require('@forrestjs/feature-locale'),
    ],
    features: [
        // require('./features/pages'),
        // require('./features/gigsguide'),
    ],
})
