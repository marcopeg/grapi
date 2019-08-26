import React, { useState, useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import * as styles from './Modal.module.scss'

const ModalContentWithGestoure = ({ children, animation, gestureSize, onRequestHide }) => {
    const contentEl = useRef(null)
    const [ activePosition, setActivePosition ] = useState([ null, null ])

    useLayoutEffect(() => {
        let initialPosition = null
        let activePosition = null

        const touchStartHandler = (e) => {
            e.preventDefault()
            e.stopPropagation()
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
                onRequestHide({
                    name: 'slideRight',
                    movement: activePosition,
                })
            } else if (animation === 'slideUp' && activePosition[1] > gestureSize) {
                onRequestHide({
                    name: 'slideDown',
                    movement: activePosition,
                })
            }

            initialPosition = [ null, null ]
            setActivePosition(activePosition = [ null, null ])
        }

        // Attach and detach the event handlers
        const target = contentEl.current
        target.addEventListener('touchstart', touchStartHandler)
        target.addEventListener('touchmove', touchMoveHandler)
        target.addEventListener('touchend', touchEndHandler)
        target.addEventListener('touchcancel', touchEndHandler)

        return () => {
            target.removeEventListener('touchstart', touchStartHandler)
            target.removeEventListener('touchmove', touchMoveHandler)
            target.removeEventListener('touchend', touchEndHandler)
            target.removeEventListener('touchcancel', touchEndHandler)
        }
    }, [true]) // eslint-disable-line

    // translate the content if it's during a closing transition
    let contentStyle = {}

    if (animation === 'slideLeft' && activePosition[0] !== null) {
        contentStyle = {
            transform: `translate3d(${activePosition[0]}px, 0, 0)`,
            transition: 'none',
        }
    }

    if (animation === 'slideUp' && activePosition[1] !== null) {
        contentStyle = {
            transform: `translate3d(0, ${activePosition[1]}px, 0)`,
            transition: 'none',
        }
    }

    return (
        <div
            ref={contentEl}
            className={styles.inner}
            style={contentStyle}
            children={children}
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
    gestureSize: 48,
}

export default ModalContentWithGestoure
