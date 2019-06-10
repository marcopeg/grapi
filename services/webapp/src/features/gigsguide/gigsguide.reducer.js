export const initialState = {
    list: [],
    map: {},
}

/**
* Actions
*/

export const SET_LIST = 'setList@gigsguire'
export const SET_ITEM = 'setItem@gigsguire'

export const setList = (items) => ({
    type: SET_LIST,
    payload: { items },
})

export const setItem = (item) => ({
    type: SET_ITEM,
    payload: { item },
})

/**
* Handlers
*/

export const actionHandlers = {
    [SET_LIST]: (state, { payload }) => ({
        ...state,
        list: [
            ...payload.items,
        ],
    }),
    [SET_ITEM]: (state, { payload }) => ({
        ...state,
        map: {
            ...state.map,
            [payload.item._id]: payload.item,
        },
    }),
}

export default (state = initialState, action) => {
    const handler = actionHandlers[action.type]
    return handler ? handler(state, action) : state
}
