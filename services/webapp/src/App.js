import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Switch, Route } from 'react-router-dom'
import { injectIntl, intlShape, defineMessages } from 'react-intl'

import { GigsGuideList, GigsGuideEvent } from 'features/gigsguide'
import './App.css'

const messages = defineMessages({
    welcome: {
        id: 'app.welcome',
        defaultMessage: 'Hello Workd Gigs Guide',
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
            <Route exact path="/" component={GigsGuideList} />
            <Route exact path="/:eventId" component={GigsGuideEvent} />
        </Switch>
    </div>
)

App.propTypes = {
    name: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
}

export default injectIntl(connect(mapState)(App))
