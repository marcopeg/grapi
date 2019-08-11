import metaOrigin from './origin'
import metaToken from './token'

export default async (meta, graphql) => {
    await metaOrigin(meta, graphql)
    await metaToken(meta, graphql)
}
