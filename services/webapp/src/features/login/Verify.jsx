/* eslint-disable */

import React from 'react'
import { connect } from 'react-redux'
import { runQuery } from '@forrestjs/feature-network'
import { Redirect } from 'react-router-dom'

class Verify extends React.Component {
    constructor (props) {
        super (props)
        this.state = {
            verified: null,
            origin: null,
            error: null,
        }
    }

    async componentDidMount () {
        const res = await this.props.dispatch(runQuery('query { session { id auth { origin uname } } }'))
        try {
            this.setState({
                verified: true,
                origin: res.data.session.auth.origin || res.data.session.auth.uname,
            })
        } catch (err) {
            this.setState({
                verified: true,
                error: 'login required',
            })
        }
    }

    render () {
        if (this.state.verified && this.state.error) {
            return <Redirect to="/login" />
        }

        return (
            <div>
                {this.state.origin || 'verifying...'}
                <hr />
                <a href="/auth/logout">Logout</a>
            </div>
        )
    }
}

export default connect()(Verify)
