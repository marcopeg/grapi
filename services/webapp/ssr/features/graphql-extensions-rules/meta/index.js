import metaOrigin from './origin'

export default async (meta, graphql) => {
    await metaOrigin(meta, graphql)
}
