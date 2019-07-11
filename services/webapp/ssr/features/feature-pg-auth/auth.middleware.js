
export const addAuth = (config, ctx) => (req, res, next) => {
    console.log('ADD AUTH MID')

    req.auth = {}
    req.auth.validate = () => {

    }

    next()
}
