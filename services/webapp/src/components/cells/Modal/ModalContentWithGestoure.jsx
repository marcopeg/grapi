/* eslint-disable */
import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import * as styles from './Modal.module.scss'
import { BasicAnimationDuration } from '_variables'
import useModalTouchGesture from './use-modal-touch-gesture'

const ModalContentWithGestoure = ({
    animation,
    tolerance,
    duration,
    onRequestHide,
    useGestures, // eslint-disable-line
    useBackdrop, // eslint-disable-line
    ...props
}) => {
    const contentEl = useRef(null)

    const gestureStyle = useModalTouchGesture({
        targetRef: contentEl,
        animation,
        duration,
        tolerance,
        callback: distance => onRequestHide({
            name: animation,
            distance,
        })
    })

    return (
        <div
            ref={contentEl}
            className={styles.inner}
            style={gestureStyle}
            {...props}
        />
    )
}

ModalContentWithGestoure.propTypes = {
    children: PropTypes.any.isRequired, // eslint-disable-line
    animation: PropTypes.oneOf([ 'slideLeft', 'slideUp' ]).isRequired,
    duration: PropTypes.number,
    tolerance: PropTypes.number,
    onRequestHide: PropTypes.func.isRequired,
}

ModalContentWithGestoure.defaultProps = {
    duration: parseInt(BasicAnimationDuration, 10),
    tolerance: 30,
}

export default React.memo(ModalContentWithGestoure)
