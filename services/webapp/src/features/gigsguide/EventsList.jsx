/* eslint-disable */

import React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { loadEvents } from './gigsguide.service'

const mapState = ({ gigsguide }) => ({
    events: gigsguide.list,
    shouldLoad: gigsguide.list.length === 0,
})

const mapDispatch = { loadEvents }

class EventsList extends React.Component {
    constructor (props) {
        super(props)
        if (this.props.shouldLoad) {
            this.props.loadEvents()
        }
    }

    render () {
        if (this.props.shouldLoad) {
            return <div>loading....</div>

        }
        return (
            <div>
                <Helmet>
                    <title>Events List</title>
                </Helmet>
                {this.props.events.map(event => (
                    <div key={event._id}>
                        <Link to={`/${event._id}`}>
                            {event._id} - {event.title}
                        </Link>
                        <hr />
                    </div>
                ))}    
            </div>
        )
    }
}

export default connect(mapState, mapDispatch)(EventsList)
