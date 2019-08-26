import React from 'react'
import PropTypes from 'prop-types'
import View from 'components/atoms/View'
import useWindowSize from 'effects/use-window-size'

const basicStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
}

const ScreenView = ({
    style,
    width,
    height,
    marginTop,
    marginBottom,
    marginRight,
    marginLeft,
    ...props
}) => {
    let dimensions = {
        ...useWindowSize(),
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
    }

    if (width) {
        const margin = (dimensions.width - dimensions.width / 100 * width) / 2
        dimensions.marginLeft = margin
        dimensions.marginRight = margin
        dimensions.width -= margin * 2
    }

    if (height) {
        const margin = (dimensions.height - dimensions.height / 100 * height) / 2
        dimensions.marginTop = margin
        dimensions.marginBottom = margin
        dimensions.height -= margin * 2
    }

    if (marginTop) {
        const margin = dimensions.height / 100 * marginTop
        dimensions.marginTop += margin
        dimensions.height -= margin
    }

    if (marginBottom) {
        const margin = dimensions.height / 100 * marginBottom
        dimensions.marginBottom += margin
        dimensions.height -= margin
    }

    if (marginLeft) {
        const margin = dimensions.width / 100 * marginLeft
        dimensions.marginLeft += margin
        dimensions.width -= margin
    }

    if (marginRight) {
        const margin = dimensions.width / 100 * marginRight
        dimensions.marginRight += margin
        dimensions.width -= margin
    }

    const applyStyle = {
        ...basicStyle,
        ...dimensions,
        ...style,
    }

    return <View style={applyStyle} {...props} />
}

ScreenView.propTypes = {
    style: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    marginTop: PropTypes.number,
    marginBottom: PropTypes.number,
    marginLeft: PropTypes.number,
    marginRight: PropTypes.number,
}

ScreenView.defaultProps = {
    width: 0,
    height: 0,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    style: {},
}

export default ScreenView
