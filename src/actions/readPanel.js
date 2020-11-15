
// style: React style object
export const setMenuStyle = (style) => ({
    type: "readPanel/SETMENUSTYLE",
    style
})

// target: Node
export const setTarget = (target) => ({
    type: "readanel/SETTARGET",
    target
})

export const showMenu = (target, x, y) => {
    let vw = window.screen.availWidth;
    let vh = window.screen.availHeight;
    let mw = 60;
    let mh = 200;
    let margin = 8;

    if (x + mw > vw) x = vw - mw - margin;
    if (y + mh > vh) y = vh - mh - margin;

    const style = {
        top: y,
        left: x,
        opacity: 1,
        pointerEvents: 'all',
    }

    return dispatch =>{
        dispatch(setMenuStyle(style));
        dispatch(setTarget(target));
    }
}