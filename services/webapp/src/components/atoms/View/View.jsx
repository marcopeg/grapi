import React from 'react'
import PropTypes from 'prop-types'
import * as styles from './View.module.scss'

const getClassNames = ({ inline, centered, scrollable, mask, vertical, spaced }) => {
    const classes = []
    inline && classes.push(styles.inline)
    !inline && classes.push(styles.block)
    centered && classes.push(styles.centered)
    scrollable && classes.push(styles.scrollable)
    mask && classes.push(styles.mask)
    vertical && classes.push(styles.vertical)
    spaced && classes.push(styles.spaced)
    return classes.join(' ')
}

const View = ({ children, inline, centered, scrollable, mask, vertical, spaced, ...props }) => (
    <div
        {...props}
        className={getClassNames({ inline, centered, scrollable, mask, vertical, spaced })}
    >
        {children}
    </div>
)

View.propTypes = {
    children: PropTypes.any, // eslint-disable-line
    inline: PropTypes.bool,
    centered: PropTypes.bool,
    scrollable: PropTypes.bool,
    mask: PropTypes.bool,
    vertical: PropTypes.bool,
    spaced: PropTypes.bool,
}

View.defaultProps = {
    children: null,
    inline: false,
    centered: false,
    scrollable: false,
    mask: false,
    vertical: false,
    spaced: false,
}

export default View
