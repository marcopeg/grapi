/* eslint-disable */

import React from 'react'
import { withAuth } from 'features/login'
import LayoutDefault from 'containers/LayoutDefault'
import { Link } from 'react-router-dom'

const HomePage = () => (
    <LayoutDefault>
        <Link to="/journal">Journal APP</Link><br />
        <Link to="/ui">Ui Tests</Link><br />
    </LayoutDefault>
)

const HomePagePublic = () => (
    <div>
        <Link to="/login">LogIN</Link>
    </div>
)

export default withAuth({ fallback: HomePagePublic })(HomePage)
