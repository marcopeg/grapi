import { runQuery } from '@forrestjs/feature-network'
import { setId } from './auth.reducer'

const loginQuery = `
    mutation (
        $uname:String!
        $passw:String!
    ) {
        login (
        uname: $uname
        passw:$passw
        ) {
            id
        }
    }`

const authQuery = `
    query me {
        session {
            auth {
                id
            }
        }
    }`

export const login = (uname, passw) => async (dispatch) => {
    try {
        const res = await dispatch(runQuery(loginQuery, { uname, passw }))
        dispatch(setId(res.data.login.id))
    } catch (err) {
        console.log(err.message)
    }
}

export const start = () => async (dispatch) => {
    try {
        const res = await dispatch(runQuery(authQuery))
        dispatch(setId(res.data.session.auth.id))
    } catch (err) {} // eslint-disable-line
}
