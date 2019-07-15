/* eslint-disable */

import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { runQuery } from '@forrestjs/feature-network'
import Verify from './Verify'

const query = `
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

class Login extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            logged: false,
        }
    }
    onSubmit = async (evt) => {
        evt.preventDefault()
        evt.stopPropagation()

        await this.props.dispatch(runQuery(query, {
            uname: evt.target[0].value,
            passw: evt.target[1].value,
        }))

        this.setState({ logged: true })
    }

    render () {
        return (
            <div>
                <Route exact path="/login" component={() => (
                    this.state.logged ? <Redirect to="/login/verify" /> : (
                        <div>
                            <a href="/auth/facebook">Login with Facebook</a><br />
                            <a href="/auth/google">Login with Google</a><br />
                            <a href="/auth/github">Login with GitHub</a><br />
                            <a href="/auth/instagram">Login with Instagram</a><br />
                            <hr />
                            <form type="POST" onSubmit={this.onSubmit}>
                                <input type="text" name="uname" placeholder="username" />
                                <input type="password" name="passw" placeholder="password" />
                                <button>Login</button>
                            </form>
                        </div>
                    )
                )} />
                <Route exact path="/login/verify" component={Verify} />
                <Route path="/me" component={() => (
                    <div>
                        myself...
                    </div>
                )} />
            </div>
        )
    }
}


export default connect()(Login)
