import React from 'react'
import { Switch, Route } from 'react-router-dom'
import JournalWrite from './JournalWrite'

const JournalWriteRouter = () => (
    <Switch>
        <Route path="/write" component={JournalWrite} />
    </Switch>
)

export default JournalWriteRouter
