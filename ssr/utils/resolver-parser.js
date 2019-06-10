import 'isomorphic-fetch'
import clone from 'clone-deep'
import { template } from './template'
import { dotted } from './dotted'

const resolverParserREST = (config) => async (variables) => {
    const fetchConfig = {
        method: (config.method || 'GET').toUpperCase(),
        headers: clone(config.headers || {}),
        body: clone(config.body || {}),
    }

    // handle variables in headers
    Object.keys(fetchConfig.headers).forEach(key => {
        fetchConfig.headers[key] = template(fetchConfig.headers[key], variables)
    })

    // handle variables in body
    Object.keys(fetchConfig.body).forEach(key => {
        if (typeof fetchConfig.body[key] === 'string') {
            fetchConfig.body[key] = template(fetchConfig.body[key], variables)
        }
    })
    fetchConfig.body = JSON.stringify(fetchConfig.body)

    const url = template(config.url, variables)
    const res = await fetch(url, fetchConfig)

    const data = await res.json()
    return dotted(data, config.grab)
}

const resolverParserGQL = (config) => {
    const restConfig = {
        url: config.url,
        method: (config.method || 'POST').toUpperCase(),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    }

    return async (variables) => {
        const restRequest = resolverParserREST({
            ...restConfig,
            body: {
                query: config.query,
                variables,
            },
        })

        const res = await restRequest(variables)
        return dotted(res, config.grab)
    }
}

const parsers = {
    rest: resolverParserREST,
    graphql: resolverParserGQL,
}

export const resolverParser = (config) =>
    parsers[config.type](config)
