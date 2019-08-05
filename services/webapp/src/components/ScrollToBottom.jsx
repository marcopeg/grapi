import React from 'react'
import PropTypes from 'prop-types'

class ScrollToBottom extends React.PureComponent {
    constructor (props) {
        super(props)
        this.el = React.createRef()
        this.clock = null
    }

    componentDidMount () {
        this.clock = setInterval(this.scrollToBottom, this.props.interval)
    }

    componentWillUnmount () {
        clearInterval(this.clock)
    }

    scrollToBottom = () => this.el.current.scrollIntoView({ behavior: this.props.behavior })

    render () {
        return (
            <div ref={this.el} />
        )
    }
}

ScrollToBottom.propTypes = {
    interval: PropTypes.number,
    behavior: PropTypes.oneOf([ 'auto', 'smooth' ]),
}

ScrollToBottom.defaultProps = {
    interval: 50,
    behavior: 'auto',
}

export default ScrollToBottom
