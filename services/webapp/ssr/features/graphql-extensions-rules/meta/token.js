/**
 * Tries to validate an API token against the database.
 *
 * - graphql.args  "xGrapiOrigin"
 * - req.header    "x-grapi-origin"
 */

// import { decode } from '@forrestjs/service-jwt'
import { getGraphqlToken } from '../../graphql-extensions-manager'

export default async (meta, graphql) => {
    try {
        meta.token = await getGraphqlToken(meta.extension)
    } catch (err) {
        meta.token = false
    }
}
