import { useState, useEffect } from 'react'
import useTouchEnd from 'effects/use-touch-end'
import useTouchDistance from 'effects/use-touch-distance'

const parseDistance = (distance, animation) => {
    if (animation === 'slideLeft') {
        return [
            distance[0] > 0 ? distance[0] : 0,
            0,
        ]
    }

    if (animation === 'slideUp') {
        return [
            0,
            distance[1] > 0 ? distance[1] : 0,
        ]
    }

    return [ 0, 0 ]
}

const detectClose = (distance, tolerance, animation) => {
    if (animation === 'slideLeft') {
        return distance[0] > window.innerWidth * tolerance / 100
    }

    if (animation === 'slideUp') {
        return distance[1] > window.innerHeight * tolerance / 100
    }

    return false
}

const computeAnimationSpeed = (distance, animation, duration) => {
    if (animation === 'slideLeft') {
        return Math.round(duration * (1 - distance[0] / window.innerWidth))
    }

    if (animation === 'slideUp') {
        return Math.round(duration * (1 - distance[1] / window.innerHeight))
    }

    return Math.round(duration / 1.8)
}

const useModalTouchGesture = ({
    targetRef,
    tolerance,
    animation,
    duration,
    callback,
}) => {
    const [ distance, setDistance ] = useState(null)
    const [ isClosing, setIsClosing ] = useState(false)
    const [ animationSpeed, setAnimationSpeed ] = useState(duration)

    // calculate horizontal distance
    const rawDistance = useTouchDistance(targetRef)
    const liveDistance = parseDistance(rawDistance, animation)

    // update swiping distance only if is active
    // need to manual cache the update for better performances
    useEffect(() => {
        const val = liveDistance[0] || liveDistance[1] ? liveDistance : null
        try {
            if (val === null && distance === null) return
            if (val[0] === distance[0] && val[1] === distance[1]) return
        } catch (err) {} // eslint-disable-line
        setDistance(val)
    }, [ liveDistance, distance ])

    // freeze the position of the modal for animation and release it
    // after the animation times out
    useTouchEnd(targetRef, () => {
        if (distance && detectClose(distance, tolerance, animation)) {
            setIsClosing(true)
            setDistance(liveDistance)
            setAnimationSpeed(computeAnimationSpeed(distance, animation, duration))

            setTimeout(() => {
                setIsClosing(false)
                setDistance(null)
            }, duration)

            callback(liveDistance)
        }
    })

    const style = {}

    // Speed up the animation during closing time
    if (isClosing) {
        style.transition = `${animationSpeed}ms`
    } else {
        style.transition = `${duration}ms`
    }

    // Move the modal with the swipe
    if (distance && !isClosing) {
        style.transform = `translate3d(${distance[0]}px, ${distance[1]}px, 0)`
        style.transition = 'none'
    }

    return style
}

export default useModalTouchGesture
