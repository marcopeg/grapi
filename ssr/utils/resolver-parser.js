import 'isomorphic-fetch'
import { template } from './template'

const resolverParserREST = (config) => {
    const fetchConfig = {
        method: (config.method || 'GET').toUpperCase(),
        headers: config.headers || {},
        body: config.body || {},
    }

    return async (variables) => {
        // handle variables in headers
        Object.keys(fetchConfig.headers).forEach(key => {
            fetchConfig.headers[key] = template(fetchConfig.headers[key], variables)
        })

        // handle variables in body
        Object.keys(fetchConfig.body).forEach(key => {
            fetchConfig.body[key] = template(fetchConfig.body[key], variables)
        })
        fetchConfig.body = JSON.stringify(fetchConfig.body)

        const url = template(config.url, variables)
        const res = await fetch(url, fetchConfig)
        return res.json()
    }
}

const resolverParserGQL = (config) => {}

const parsers = {
    rest: resolverParserREST,
    graphql: resolverParserGQL,
}

export const resolverParser = (config) =>
    parsers[config.type](config)
