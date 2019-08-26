import React, { useState, useEffect } from 'react'

const getWindowSize = () => ({
    height: window.innerHeight,
    width: window.innerWidth,
    // outerHeight: window.outerHeight,
    // outerWidth: window.outerWidth,
})

const useWindowSize = () => {
    const [ currentSize, setCurrentSize ] = useState(getWindowSize())
    const handleResize = () => setCurrentSize(getWindowSize())

    useEffect(() => {
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return currentSize
}

export default useWindowSize
