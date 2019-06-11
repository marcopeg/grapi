/**
 * REACT SSR
 *
 * - authenticated sessions are not render
 * - cache key is applied as: lang-session-url
 *
 */

export const shouldRender = async (req, res) =>
    Boolean(req.session) === false

export const getCacheKey = async (req, res) => {
    const session = req.session
        ? req.session.id
        : '*'

    const locale = req.locale
        ? `${req.locale.language}_${req.locale.region}`
        : '*'

    return { value: `${locale}~${session}~${req.url}` }
}
