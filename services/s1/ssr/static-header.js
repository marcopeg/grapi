
export const validateStaticHeader = (value, {
    header = 'x-static-signature',
    statusCode = 400,
    statusMessage = 'Invalid Static Signature',
} = {}) =>
    (req, res, next) => {
        if (req.headers[header] === value) {
            next()
        } else {
            res.statusMessage = statusMessage
            res.status(statusCode).end()
        }
    }
