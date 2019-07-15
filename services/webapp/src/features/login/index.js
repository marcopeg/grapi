export const services = [
    require('./auth.service'),
]

export const reducers = {
    auth: require('./auth.reducer').default,
}

export { default as Login } from './Login'
