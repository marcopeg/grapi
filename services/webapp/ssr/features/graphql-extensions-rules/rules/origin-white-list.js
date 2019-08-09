/**
 * White lists origins in order to accept a request
 *
 * {
 *   "rule": "originWhiteList",
 *    "accept": [ "value", "value", ... ]
 * }
 */

export default (rule, meta, graphql) => {
    if (!rule.accept.includes(meta.origin)) {
        throw new Error(`Origin "${meta.origin}" not allowed`)
    }
}
