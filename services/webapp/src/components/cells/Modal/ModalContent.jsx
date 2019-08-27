import React from 'react'
import * as styles from './Modal.module.scss'

const ModalContent = ({
    useGestures, // eslint-disable-line
    useBackdrop, // eslint-disable-line
    onRequestHide, // eslint-disable-line
    ...props
}) => (
    <div
        {...props}
        className={styles.inner}
    />
)

export default ModalContent
