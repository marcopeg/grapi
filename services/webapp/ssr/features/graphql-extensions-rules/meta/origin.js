/**
 * Tries to validate an API token against the database.
 *
 * - graphql.args  "xGrapiOrigin"
 * - req.header    "x-grapi-origin"
 */

import { decode } from '@forrestjs/service-jwt'
import { validateGraphqlToken } from '../../graphql-extensions-manager'

export default async (meta, graphql) => {
    const { args, context } = graphql
    try {
        const token = args.xGrapiOrigin || context.req.headers['x-grapi-origin']
        const data = decode(token)
        await validateGraphqlToken({ token, extension: data.payload })
        meta.origin = data.payload
    } catch (err) {
        meta.origin = false
    }
}
