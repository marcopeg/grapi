import React from 'react'
import PropTypes from 'prop-types'
import { getDOMSize } from 'lib/get-dom-size'
import * as styles from './View.module.scss'

const getClassNames = ({ className, inline, centered, scrollable, mask, vertical, spaced }) => {
    const classes = Array.isArray(className)
        ? [...className]
        : className.split(' ')

    inline && classes.push(styles.inline)
    !inline && classes.push(styles.block)
    centered && classes.push(styles.centered)
    scrollable && classes.push(styles.scrollable)
    mask && classes.push(styles.mask)
    vertical && classes.push(styles.vertical)
    spaced && classes.push(styles.spaced)

    return classes.join(' ')
}

class View extends React.PureComponent {
    constructor (props) {
        super(props)
        this.el = React.createRef()
    }

    getSize = () => getDOMSize(this.el)

    render () {
        const { children, className, inline, centered, scrollable, mask, vertical, spaced, ...props } = this.props
        const applyClassName = getClassNames({ className, inline, centered, scrollable, mask, vertical, spaced })

        return (
            <div
                {...props}
                ref={this.el}
                className={applyClassName}
            >
                {children}
            </div>
        )
    }
}

View.propTypes = {
    children: PropTypes.any, // eslint-disable-line
    className: PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    inline: PropTypes.bool,
    centered: PropTypes.bool,
    scrollable: PropTypes.bool,
    mask: PropTypes.bool,
    vertical: PropTypes.bool,
    spaced: PropTypes.bool,
}

View.defaultProps = {
    children: null,
    className: [],
    inline: false,
    centered: false,
    scrollable: false,
    mask: false,
    vertical: false,
    spaced: false,
}

export default View
