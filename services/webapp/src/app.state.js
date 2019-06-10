import createSSRState from '@forrestjs/core/lib/create-ssr-state'
import app from './app.reducer'

const reducers = {
    app,
}

const features = [
    require('@forrestjs/feature-storage/client'),
    require('@forrestjs/feature-network/client'),
    require('@forrestjs/feature-locale/client'),
    require('features/locale'),
    // require('features/pages'),
    require('features/gigsguide'),
]

export const createState = createSSRState(reducers, features)
