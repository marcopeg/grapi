/**
 * - it creates a new session if does not exists
 * - it reads and validates a running session
 * - it extends the session validity (replacing the JWT in the cookie)
 *
 */

export default (settings) => (req, res, next) => {
    console.log('SESSION MID', settings)
    next()
}
