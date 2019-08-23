import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withAuth, Login } from 'features/login'
import { fetchJournal, saveJournal, checkPin, savePin } from './journal.service'

import AskPin from './AskPin'
import JournalWrite from './JournalWrite'
import LayoutDefault from 'containers/LayoutDefault'

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
        const body = hasPin
            ? <JournalWrite {...props} />
            : <AskPin onSubmit={savePin} />

        return (
            <LayoutDefault>
                {body}
            </LayoutDefault>
        )
    }
}

JournalMain.propTypes = {
    hasPin: PropTypes.bool.isRequired,
    savePin: PropTypes.func.isRequired,
    checkPin: PropTypes.func.isRequired,
}

export default connect(mapState, mapDispatch)(withAuth({ fallback: Login })(JournalMain))
