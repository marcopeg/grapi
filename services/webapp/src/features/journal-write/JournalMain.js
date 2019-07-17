/* eslint-disable */
import React from 'react'
import { connect } from 'react-redux'
import { withAuth } from 'features/login'
import { fetchJournal, saveJournal, checkPin, savePin } from './journal.service'

import AskPin from './AskPin'
import JournalWrite from './JournalWrite'

const mapState = ({ journal }) => ({
    hasPin: journal.pin !== null,
})

const mapDispatch = {
    checkPin,
    savePin,
    fetchJournal,
    saveJournal,
}

class JournalMain extends React.Component {
    componentDidMount () {
        this.props.checkPin()
    }

    render () {
        const { hasPin, savePin, ...props } = this.props
        return hasPin
            ? <JournalWrite {...props} />
            : <AskPin onSubmit={savePin} />
    }
}

export default connect(mapState, mapDispatch)(withAuth()(JournalMain))
