import React from 'react'
import { withAuth } from 'features/login'
import { Link } from 'react-router-dom'
import * as styles from './HomePage.module.scss'

const HomePage = () => (
    <div>
        <Link to="/journal" className={styles.link}>Journal APP</Link><br />
        <Link to="/ui" className={styles.link}>Ui Tests</Link><br />
    </div>
)

const HomePagePublic = () => (
    <div>
        <Link to="/login">LogIN</Link>
    </div>
)

export default withAuth({ fallback: HomePagePublic })(HomePage)
