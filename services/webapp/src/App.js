/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { injectIntl, intlShape, defineMessages } from 'react-intl'
import { Switch, Route } from 'react-router-dom'

import { HomePage } from 'features/pages'
import { LoginAPP } from 'features/login'
import { JournalAPP } from 'features/journal'

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
        <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/journal" component={JournalAPP} />
            <Route path="/login" component={LoginAPP} />
        </Switch>
    </div>
)

App.propTypes = {
    name: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
}

export default injectIntl(connect(mapState)(App))
