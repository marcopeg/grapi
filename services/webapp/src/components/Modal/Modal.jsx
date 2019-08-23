/* eslint-disable */

import React from 'react'
import ReactDOM from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import * as styles from './Modal.module.scss'
import { BasicAnimationDuration } from '_variables'

const animationTimeout = parseInt(BasicAnimationDuration, 10) * 1.5

const Modal = ({ children, isVisible, animation, useBackdrop, onRequestHide }) => {
    // optional backdrop
    const backdrop = useBackdrop
        ? (
            <div
                className={styles.drop}
                onClick={() => onRequestHide()}
                children={typeof useBackdrop === 'object' ? useBackdrop : null}
            />
        )
        : null

    const item = (
        <div className={styles.wrapper}>
            {backdrop}
            <div className={styles.inner} children={children} />
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

Modal.defaultProps = {
    animation: 'fade',
    useBackdrop: false,
    onRequestHide: () => {},
}

export default Modal
