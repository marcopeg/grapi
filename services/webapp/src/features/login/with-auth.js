import React from 'react'
import { connect } from 'react-redux'

const mapState = ({ auth }) => ({ auth })

const createFallback = fallback =>
    fallback && typeof fallback === 'function'
        ? React.createElement(fallback)
        : fallback

export default ({
    fallback = null,
} = {}) =>
    WrappedComponent =>
        connect(mapState)((props) =>
            props.auth.id
                ? React.createElement(WrappedComponent, props)
                : createFallback(fallback)
        )
