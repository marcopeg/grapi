import React, { useState, useEffect } from 'react'

const useTouchDistance = (targetRef) => {
    const [ distance, setDistance ] = useState([ 0, 0 ])

    useEffect(() => {
        let startPosition = [ 0, 0 ]
        const onTouchStart = e => (startPosition = [ e.touches[0].pageX, e.touches[0].pageY ])
        const onTouchEnd = e => {
            startPosition = [ 0, 0 ]
            setDistance([ 0, 0 ])
        }
        const onTouchMove = (e) => {
            if (startPosition[0]) {
                e.preventDefault()
                e.stopPropagation()
                setDistance([
                    e.touches[0].pageX - startPosition[0],
                    e.touches[0].pageY - startPosition[1],
                ])
            }
        }

        // Attach and detach the event handlers
        const target = targetRef.current
        target.addEventListener('touchstart', onTouchStart, true)
        target.addEventListener('touchmove', onTouchMove, true)
        target.addEventListener('touchend', onTouchEnd, true)
        target.addEventListener('touchcancel', onTouchEnd, true)

        return () => {
            target.removeEventListener('touchstart', onTouchStart, true)
            target.removeEventListener('touchmove', onTouchMove, true)
            target.removeEventListener('touchend', onTouchEnd, true)
            target.removeEventListener('touchcancel', onTouchEnd, true)
        }
    }, [targetRef])

    return distance
}

export default useTouchDistance
