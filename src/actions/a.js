
export const setShow = status => ({
    type: 'a/SETSHOW',
    status
})

export const setHref = href => ({
    type: 'a/SETHREF',
    href
})

// a = <a>
export const tapA = a => {
    let href = a.href;

    return dispatch => {
        dispatch(setHref(href))
        dispatch(setShow(true))
    }
}