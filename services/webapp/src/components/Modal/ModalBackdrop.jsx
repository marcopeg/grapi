import React, { useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import * as styles from './Modal.module.scss'

const ModalBackdrop = ({ onRequestHide, useBackdrop }) => {
    const backdropEl = useRef(null)

    useLayoutEffect(() => {
        let initialPosition = [ 0, 0 ]
        let activePosition = [ 0, 0 ]

        const cancelEvent = (e) => {
            e.preventDefault()
            e.stopPropagation()
        }

        const touchStartHandler = (e) => {
            cancelEvent(e)
            initialPosition = [ e.touches[0].pageX, e.touches[0].pageY ]
        }

        const touchMoveHandler = (e) => {
            cancelEvent(e)

            if (initialPosition[0] === null) {
                return
            }

            const dX = e.touches[0].pageX - initialPosition[0]
            const dY = e.touches[0].pageY - initialPosition[1]
            activePosition = [ dX, dY ]
        }

        const touchEndHandler = (e) => {
            cancelEvent(e)

            if (activePosition[0] < 5 && activePosition[1] < 5) {
                onRequestHide({
                    name: 'backdropClick',
                    movement: activePosition,
                })
            }

            initialPosition = [ 0, 0 ]
            activePosition = [ 0, 0 ]
        }
        // Attach and detach the event handlers
        const target = backdropEl.current
        target.addEventListener('touchstart', touchStartHandler)
        target.addEventListener('touchmove', touchMoveHandler)
        target.addEventListener('touchend', touchEndHandler)
        target.addEventListener('touchcancel', touchEndHandler)
        target.addEventListener('scroll', cancelEvent)

        return () => {
            target.removeEventListener('touchstart', touchStartHandler)
            target.removeEventListener('touchmove', touchMoveHandler)
            target.removeEventListener('touchend', touchEndHandler)
            target.removeEventListener('touchcancel', touchEndHandler)
            target.removeEventListener('scroll', cancelEvent)
        }
    }, [true]) // eslint-disable-line

    return (
        <div
            ref={backdropEl}
            className={styles.drop}
            onClick={() => onRequestHide()}
            children={typeof useBackdrop === 'object' ? useBackdrop : null}
        />
    )
}

ModalBackdrop.propTypes = {
    onRequestHide: PropTypes.func.isRequired,
    useBackdrop: PropTypes.bool.isRequired,
}

export default ModalBackdrop
