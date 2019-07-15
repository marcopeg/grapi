import React from 'react'
import { Route } from 'react-router-dom'
import Verify from './Verify'

const Login = () => (
    <div>
        <Route exact path="/login" component={() => (
            <div>
                <a href="/auth/facebook">Login with Facebook</a><br />
                <a href="/auth/google">Login with Google</a><br />
                <a href="/auth/github">Login with GitHub</a><br />
                <a href="/auth/instagram">Login with Instagram</a><br />
            </div>
        )} />
        <Route exact path="/login/verify" component={Verify} />
        <Route path="/me" component={() => (
            <div>
                myself...
            </div>
        )} />
    </div>
)

export default Login
