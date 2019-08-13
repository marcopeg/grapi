import jwt from 'jsonwebtoken'

const query = `
    mutation reg (
        $token: String
        $definition: GraphQLExtension!
    ) {
        registerExtension (
            token: $token
            definition: $definition
        ) 
    }`

const data = {
    secret: null,
}

export const registerExtension = async ({ endpoint, token, definition, secret }) => {
    // Generate a new random secret
    data.secret = secret || `${definition.name}-${Date.now()}`
    definition.secret = data.secret

    // Run the GraphQL Request
    let res = null
    let doc = null
    try {
        res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query,
                variables: { token, definition },
            }),
        })
    } catch (err) {
        throw new Error(`fetch failed - ${err.message}`)
    }

    if (res.status !== 200) {
        throw new Error(`request failed - ${res.status} ${res.statusText}`)
    }

    try {
        doc = await res.json()
    } catch (err) {
        throw new Error(`unexpected response format - ${err.message}`)
    }

    if (doc.errors) {
        throw new Error(doc.errors.shift().message)
    }

    if (!doc.data.registerExtension) {
        throw new Error('Oooops, something weird happened :-|')
    }
}

export const validateSecret = (secret) =>
    new Promise((resolve, reject) => {
        jwt.verify(secret, data.secret, (err) => {
            if (err) {
                reject()
            } else {
                resolve()
            }
        })
    })

export const validateRequest = async (req, {
    header = 'x-grapi-signature',
    message = 'Invalid GRAPI Signature',
} = {}) => {
    try {
        await validateSecret(req.headers[header])
    } catch (err) {
        throw new Error(message)
    }
}

export const createRequestValidator = ({
    header = 'x-grapi-signature',
    statusCode = 400,
    statusMessage = 'Invalid GRAPI Signature',
} = {}) =>
    (req, res, next) =>
        validateRequest(req, { header })
            .then(() => next())
            .catch(() => {
                res.statusMessage = statusMessage
                res.status(statusCode).end()
            })
