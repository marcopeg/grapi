import { runQuery } from '@forrestjs/feature-network'
import { localStorage } from '@forrestjs/feature-storage'
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
        dispatch(localStorage.setItem('auth::id', res.data.login.id))
    } catch (err) {
        console.log(err.message)
    }
}

export const start = () => async (dispatch) => {
    // grab from localStorage
    const authId = dispatch(localStorage.getItem('auth::id'))

    // set a first logged in status trusting the localStorage
    if (authId) {
        dispatch(setId(authId))
    }

    // verify with an API request
    try {
        const res = await dispatch(runQuery(authQuery))
        res.data.session.auth
            ? dispatch(setId(res.data.session.auth.id))
            : dispatch({ type: '@reset' })
    } catch (err) {
        dispatch({ type: '@reset' })
    }
}
