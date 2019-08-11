/**
 * Generates a valid signature for the target Extension based on her secret
 */

import { sign } from '@forrestjs/service-jwt'
import { getSecret } from '../../../services/service-express-graphql-extension'

export default async (meta, graphql) => {
    try {
        meta.signature = await sign(meta.extension, {}, getSecret(meta.extension))
    } catch (err) {
        meta.signature = false
    }
}
