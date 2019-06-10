/* eslint-disable */

import React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { loadEvent } from './gigsguide.service'

const mapState = ({ gigsguide }, { match }) => ({
    event: gigsguide.map[match.params.eventId],
    shouldLoad: !gigsguide.map[match.params.eventId],
})

const mapDispatch = { loadEvent }

class EventItem extends React.Component {
    constructor (props) {
        super(props)
        if (this.props.shouldLoad) {
            this.props.loadEvent(this.props.match.params.eventId)
        }
    }

    render () {
        if (!this.props.event) {
            return <div>loading...</div>
        }

        return (
            <div>
                <Helmet>
                    <title>{this.props.event.title}</title>
                </Helmet>
                <h1>{this.props.event.title}</h1>
                <small>{this.props.match.params.eventId}</small>
                <hr />
                <Link to="/">back</Link>
            </div>
        )
    }
}

export default connect(mapState, mapDispatch)(EventItem)