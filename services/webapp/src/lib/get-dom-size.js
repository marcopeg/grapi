
export const getDOMSize = el => ({
    client: {
        width: el.current.clientWidth,
        height: el.current.clientHeight,
    },
    offset: {
        width: el.current.offsetWidth,
        height: el.current.offsetHeight,
    },
})
