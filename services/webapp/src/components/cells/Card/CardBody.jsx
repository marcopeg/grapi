import React from 'react'
import PropTypes from 'prop-types'
import View from 'components/atoms/View'

const CardBody = ({ children, style, height, scrollable, ...props }) => {
    const applyStyle = {
        ...style,
        ...(height !== null ? { height } : {}),
    }

    return (
        <View
            {...props}
            style={applyStyle}
            children={children}
            mask={!scrollable}
            scrollable={scrollable}
        />
    )
}

CardBody.propTypes = {
    children: PropTypes.any, // eslint-disable-line
    className: PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    style: PropTypes.object,
    height: PropTypes.number,
    scrollable: PropTypes.bool,
}

CardBody.defaultProps = {
    children: null,
    className: [],
    style: {},
    height: null,
    scrollable: false,
}

export default React.memo(CardBody)
