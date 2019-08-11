import jwt from 'jsonwebtoken'

const query = `
    mutation reg (
        $d: JSON!
        $r: JSON!
        $s: String
    ) {
        registerExtensionJSON (
            definition: $d
            rules: $r
            secret: $s
        ) 
    }`

const data = {
    secret: null,
}

export const registerExtensionJSON = async ({ endpoint, definition, rules, secret, token }) => {
    // Generate a new random secret
    data.secret = secret || `${definition.name}-${Date.now()}`

    // Run the GraphQL Request
    let res = null
    try {
        res = await fetch(endpoint, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                query,
                variables: {
                    d: definition,
                    r: rules || [],
                    s: data.secret,
                },
            }),
        })
    } catch (err) {
        throw new Error(`fetch failed - ${err.message}`)
    }

    if (res.status !== 200) {
        throw new Error(`request failed - ${res.status} ${res.statusText}`)
    }

    try {
        return (await res.json()).data.registerExtensionJSON
    } catch (err) {
        throw new Error(`unexpected response format - ${err.message}`)
    }
}

export const validateExtensionHeader = ({
    header = 'x-grapi-signature',
    statusCode = 400,
    statusMessage = 'Invalid GRAPI Signature',
} = {}) =>
    (req, res, next) => {
        jwt.verify(req.headers[header], data.secret, (err) => {
            if (err) {
                res.statusMessage = statusMessage
                res.status(statusCode).end()
            } else {
                next()
            }
        })
    }
