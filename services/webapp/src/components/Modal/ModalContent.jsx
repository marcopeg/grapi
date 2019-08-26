import React from 'react'
import PropTypes from 'prop-types'
import * as styles from './Modal.module.scss'

const ModalContent = ({ children }) => (
    <div
        className={styles.inner}
        children={children}
    />
)

ModalContent.propTypes = {
    children: PropTypes.any.isRequired, // eslint-disable-line
}

export default ModalContent
