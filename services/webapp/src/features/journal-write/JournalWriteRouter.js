import React from 'react'
import { Switch, Route } from 'react-router-dom'
import JournalMain from './JournalMain'

const JournalWriteRouter = () => (
    <Switch>
        <Route exact path="/" component={JournalMain} />
        <Route path="/write/:day" component={JournalMain} />
    </Switch>
)

export default JournalWriteRouter
