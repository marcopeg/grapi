import React from 'react'

const isIOS = () => {
    const ua = navigator.userAgent
    const isIphone = ua.indexOf('iPhone') !== -1
    const isIpod = ua.indexOf('iPod') !== -1
    const isIpad = ua.indexOf('iPad') !== -1
    return isIphone || isIpod || isIpad
}

class KeyboardPadding extends React.PureComponent {
    constructor (props) {
        super(props)
        this.isIOS = isIOS()
        this.state = {
            height: 0,
        }
    }

    componentDidMount () {
        if (!this.isIOS) return
        window.addEventListener('focus', this.startTracking, true)
        window.addEventListener('blur', this.stopTracking, true)
    }

    componentWillUnmount () {
        if (!this.isIOS) return
        window.removeEventListener('focus', this.startTracking)
        window.removeEventListener('blur', this.stopTracking)
    }

    startTracking = () => {
        const h1 = window.innerHeight
        let h2 = 0

        const loop = () => {
            const diff = h1 - window.innerHeight
            if (h2 !== diff) {
                h2 = diff
                setTimeout(loop, 250)
            } else {
                this.setState({ height: h2 })
            }
        }

        setTimeout(loop, 250)
    }

    stopTracking = () => {
        clearTimeout(this.timer)
        this.setState({ height: 0 })
    }

    render () {
        return this.isIOS ? (
            <div style={{
                display: this.state.height ? 'block' : 'none',
                height: this.state.height,
            }} />
        ) : null
    }
}

export default KeyboardPadding
