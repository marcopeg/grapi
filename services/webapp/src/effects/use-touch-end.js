import React, { useEffect } from 'react'

const useTouchEnd = (targetRef, callback) => {
    useEffect(() => {
        const targetEl = targetRef.current
        targetEl.addEventListener('touchend', callback)
        targetEl.addEventListener('touchcancel', callback)
        return () => {
            targetEl.removeEventListener('touchend', callback)
            targetEl.removeEventListener('touchcancel', callback)
        }
    })
}

export default useTouchEnd
