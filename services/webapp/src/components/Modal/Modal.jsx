import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import * as styles from './Modal.module.scss'
import { BasicAnimationDuration } from '_variables'

import ModalBackdrop from './ModalBackdrop'
import ModalContent from './ModalContent'
import ModalContentWithGestoure from './ModalContentWithGestoure'

const animationTimeout = parseInt(BasicAnimationDuration, 10) * 1.5

const Modal = ({ isVisible, ...props }) => {
    const { animation, useBackdrop, useGestures } = props

    const backdrop = useBackdrop
        ? <ModalBackdrop {...props} />
        : null

    const content = animation.indexOf('slide') >= 0 && useGestures === true
        ? <ModalContentWithGestoure {...props} />
        : <ModalContent {...props} />

    const item = (
        <div>
            {backdrop}
            {content}
        </div>
    )

    return ReactDOM.createPortal((
        <CSSTransition
            in={isVisible}
            timeout={animationTimeout}
            classNames={{
                enter: styles[`${animation}Enter`],
                enterActive: styles[`${animation}EnterActive`],
                enterDone: styles[`${animation}EnterDone`],
                exit: styles[`${animation}Exit`],
                exitActive: styles[`${animation}ExitActive`],
                exitDone: styles[`${animation}ExitDone`],
            }}
        >
            {item}
        </CSSTransition>
    ), document.body)
}

Modal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    useGestures: PropTypes.bool,
    useBackdrop: PropTypes.bool,
    animation: PropTypes.oneOf([ 'fade', 'slideLeft', 'slideUp' ]),
    onRequestHide: PropTypes.func,
}

Modal.defaultProps = {
    animation: 'fade',
    useBackdrop: true,
    useGestures: true,
    onRequestHide: () => {},
}

export default Modal
