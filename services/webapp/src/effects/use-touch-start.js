import React, { useEffect } from 'react'

const useTouchStart = (targetRef, callback) => {
    useEffect(() => {
        const targetEl = targetRef.current
        targetEl.addEventListener('touchstart', callback)
        return () => targetEl.removeEventListener('touchstart', callback)
    })
}

export default useTouchStart
