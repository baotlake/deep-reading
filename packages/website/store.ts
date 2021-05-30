import { useMemo } from 'react'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { configureStore, createSlice } from '@reduxjs/toolkit'

import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

// import * as core from '@wrp/reading-core'

// console.log('reducers: ', core)

const testReducer = createSlice({
    name: 'test',
    initialState: {},
    reducers: {},
})

const rootReducer = combineReducers({
    testReducer,
})

let store: ReturnType<typeof initStore>

function initStore(initialState) {
    return createStore(
        rootReducer,
        initialState,
        composeWithDevTools(applyMiddleware(thunk))
    )
}

export const initializeStore = (preloadedState) => {
    let _store = store ?? initStore(preloadedState)

    if (preloadedState && store) {
        _store = initStore({
            ...store.getState(),
            ...preloadedState,
        })

        store = undefined
    }

    if (typeof window === 'undefined') return _store

    if (!store) store = _store
    return _store
}

export function useStore(initialState) {
    const store = useMemo(() => initializeStore(initialState), [initialState])
    // const store = initializeStore(initialState)
    return store
}
