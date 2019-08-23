import React from 'react'
import PropTypes from 'prop-types'
import { getDOMSize } from 'lib/get-dom-size'

class CardFooter extends React.PureComponent {
    constructor (props) {
        super(props)
        this.el = React.createRef()
    }

    getSize = () => getDOMSize(this.el)

    render () {
        const { children, ...props } = this.props

        return (
            <div
                {...props}
                ref={this.el}
            >
                {children}
            </div>
        )
    }
}

CardFooter.propTypes = {
    children: PropTypes.any, // eslint-disable-line
}

CardFooter.defaultProps = {
    children: null,
}

export default CardFooter
