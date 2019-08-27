/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import * as styles from './Modal.module.scss'
import { BasicAnimationDuration } from '_variables'

const animationDuration = parseInt(BasicAnimationDuration, 10)

const ModalContentWithGestoure = ({
    animation,
    gestureSize,
    onRequestHide,
    useGestures, // eslint-disable-line
    useBackdrop, // eslint-disable-line
    ...props
}) => {
    const contentEl = useRef(null)
    const [ activePosition, setActivePosition ] = useState([ null, null ])
    const [ fastAnimation, setFastAnimation ] = useState(false)

    useEffect(() => {
        let initialPosition = [ 0, 0 ]
        let activePosition = [ 0, 0 ]

        const handleHide = (name) => {
            setFastAnimation(true)
            setTimeout(() => setFastAnimation(false), animationDuration)

            onRequestHide({
                name,
                movement: activePosition,
            })
        }

        const touchStartHandler = (e) => {
            initialPosition = [ e.touches[0].pageX, e.touches[0].pageY ]
        }

        const touchMoveHandler = (e) => {
            e.preventDefault()
            e.stopPropagation()

            if (initialPosition[0] === null) {
                return
            }

            const dX = e.touches[0].pageX - initialPosition[0]
            const dY = e.touches[0].pageY - initialPosition[1]
            setActivePosition(activePosition = [ dX, dY ])
        }

        const touchEndHandler = () => {
            if (animation === 'slideLeft' && activePosition[0] > gestureSize) {
                handleHide('slideRight')
            } else if (animation === 'slideUp' && activePosition[1] > gestureSize) {
                handleHide('slideDown')
            }

            initialPosition = [ null, null ]
            setActivePosition(activePosition = [ 0, 0 ])
        }

        // Attach and detach the event handlers
        const target = contentEl.current
        target.addEventListener('touchstart', touchStartHandler, true)
        target.addEventListener('touchmove', touchMoveHandler, true)
        target.addEventListener('touchend', touchEndHandler, true)
        target.addEventListener('touchcancel', touchEndHandler, true)

        return () => {
            target.removeEventListener('touchstart', touchStartHandler, true)
            target.removeEventListener('touchmove', touchMoveHandler, true)
            target.removeEventListener('touchend', touchEndHandler, true)
            target.removeEventListener('touchcancel', touchEndHandler, true)
        }
    }, [ contentEl, animation, gestureSize, onRequestHide ])

    // translate the content if it's during a closing transition
    let contentStyle = {}

    if (animation === 'slideLeft' && activePosition[0] > 0) {
        contentStyle = {
            transform: `translate3d(${activePosition[0]}px, 0, 0)`,
            transition: 'none',
        }
    }

    if (animation === 'slideUp' && activePosition[1] > 0) {
        contentStyle = {
            transform: `translate3d(0, ${activePosition[1]}px, 0)`,
            transition: 'none',
        }
    }

    // Speed up transition when closing down the modal with a gesture
    if (!contentStyle.transition) {
        if (fastAnimation) {
            contentStyle.transition = `${animationDuration / 2.5}ms`
        } else {
            contentStyle.transition = BasicAnimationDuration
        }
    }

    return (
        <div
            ref={contentEl}
            className={styles.inner}
            style={contentStyle}
            {...props}
        />
    )
}

ModalContentWithGestoure.propTypes = {
    children: PropTypes.any.isRequired, // eslint-disable-line
    animation: PropTypes.oneOf([ 'slideLeft', 'slideUp' ]).isRequired,
    gestureSize: PropTypes.number,
    onRequestHide: PropTypes.func.isRequired,
}

ModalContentWithGestoure.defaultProps = {
    gestureSize: 48 * 2,
}

export default ModalContentWithGestoure
