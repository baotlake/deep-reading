
export const showToolBar = (target, x, y) => {
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

    return {
        type: 'readPanel/SETTOOLBAR',
        toolBar: {
            target: target,
            style: style,
            show: true
        }
    }
}

export const hiddenToolBar = () => {
    return {
        type: 'readPanel/SETTOOLBAR',
        toolBar: {
            style: {},
            show: false
        }
    }
}