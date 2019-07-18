import React from 'react'
import { withAuth } from 'features/login'
import { Link } from 'react-router-dom'

const HomePage = () => (
    <div>
        <Link to="/journal">Journal APP</Link>
    </div>
)

const HomePagePublic = () => (
    <div>
        <Link to="/login">LogIN</Link>
    </div>
)

export default withAuth({ fallback: HomePagePublic })(HomePage)
