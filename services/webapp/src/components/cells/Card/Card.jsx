import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import View from 'components/atoms/View'
import CardHeader from './CardHeader'
import CardFooter from './CardFooter'
import CardBody from './CardBody'

const Card = ({ children, ...props }) => {
    const [ bodyHeight, setBodyHeight ] = useState(null)
    const cardRef = useRef(null)
    const headerRef = useRef(null)
    const footerRef = useRef(null)

    let header = null
    let footer = null
    let body = null

    useEffect(() => {
        const cardHeight = cardRef.current.getSize().client.height
        const headerHeight = header ? headerRef.current.getSize().offset.height : 0
        const footerHeight = footer ? footerRef.current.getSize().offset.height : 0
        setBodyHeight(cardHeight - headerHeight - footerHeight)
    }, [ header, footer ])

    const tokens = []
    React.Children.forEach(children, item => {
        if (item.type === CardHeader) {
            header = React.cloneElement(item, { ref: headerRef })
        } else if (item.type === CardFooter) {
            footer = React.cloneElement(item, { ref: footerRef })
        } else if (item.type === CardBody) {
            body = item
        } else {
            tokens.push(item)
        }
    })

    // Import generic tokens into the Card's body
    if (!body && tokens) {
        body = React.createElement(CardBody, null, tokens)
    }

    // Apply computed height to the Card's body
    if (body && bodyHeight) {
        body = React.cloneElement(body, { height: bodyHeight })
    }

    return (
        <View
            {...props}
            ref={cardRef}
        >
            {header}
            {body}
            {footer}
        </View>
    )
}

Card.propTypes = {
    children: PropTypes.any.isRequired, // eslint-disable-line
}

// Make sub components available
Card.Header = CardHeader
Card.Footer = CardFooter
Card.Body = CardBody

export default Card
