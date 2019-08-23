/* eslint-disable */

import React from 'react'
import * as styles from './Layout.module.scss'

const LayoutDefault = ({children}) => (
    <div
        className={styles.wrapper}
    >
        <div className={styles.header}>
            <div className={styles.title}>Marco's App</div>
        </div>
        <div className={styles.body}>
            {children}
        </div>
    </div>
)

export default LayoutDefault
