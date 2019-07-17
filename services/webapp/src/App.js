/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { injectIntl, intlShape, defineMessages } from 'react-intl'

import { Login } from 'features/login'
import { JournalWriteRouter } from 'features/journal-write'

const messages = defineMessages({
    welcome: {
        id: 'app.welcome',
        defaultMessage: 'GraphQL API Gateway',
    },
})

const mapState = ({ app, locale }) => ({
    name: app.name,
    locale: locale.locale.split('_')[0],
})

const App = ({ intl, name, locale }) => (
    <div>
        <Helmet>
            <html lang={locale} />
            <title>{name}</title>
        </Helmet>
        {intl.formatMessage(messages.welcome)}
        <hr />
        
        <JournalWriteRouter />
        <Login />
    </div>
)

App.propTypes = {
    name: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
}

export default injectIntl(connect(mapState)(App))
