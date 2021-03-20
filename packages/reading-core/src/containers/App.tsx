import React, { useEffect, useRef, MutableRefObject } from 'react';
import { connect, ConnectedProps, RootStateOrAny } from 'react-redux';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';

import * as explActions from '../actions/explanation';
import * as transActions from '../actions/translate';
import * as aActions from '../actions/a';
import * as rpActions from '../actions/readPanel';

import ManageExplanation from './ManageExplanation';
import ManageTranslatePanel from './ManageTranslatePanel';
import AModal from '../components/AModal'
import ToolMenu from './ToolMenu'

import Shadow from './Shadow'

// import './App.scss';
import styles from '!!raw-loader!sass-loader!./App.scss'

import {
    targetActionFilter,
    linkIntercept,
    getPath,
    scrollToTop
} from '../utils/core';
import Touch, { Tap, MouseMove } from '../utils/touch';

function App(props: Props) {

    const rootRef = useRef<HTMLDivElement>(null)
    const history = useHistory();

    useEffect(() => {

        const tapOptions = {
            count: 3,
            callback: () => {
                console.log('连按3次')
                history.push('/wrp-home')
                scrollToTop();
            }
        }
        const tap = new Tap(tapOptions);
        const handleClick = function (e: MouseEvent) {
            // @ts-ignore
            if (targetActionFilter(e.path || getPath(e.target), 'tapword'))
                props.tapWord(e);

            // intercept open new page
            if (props.linkIntercept !== false)
                linkIntercept(e, props.tapA);

            tap.tap(e);
            props.hiddenToolMenu();
        }

        const touch = new Touch();
        const touchStart = function (e: TouchEvent) {
            // console.log('window touchStart', e)
        }
        touch.setOnStart(touchStart)
        const onTouchMove = function (touch: Touch, e: TouchEvent) {
            // console.log('window onTouchMove', e)
        }
        touch.setOnMoving(onTouchMove)
        const onTouchEnd = function (touch: Touch, e: TouchEvent) {
            console.log('window onTouchEnd', touch, e)
            if (
                Math.abs(touch.sumX) > 50 &&
                Math.abs(touch.sumY) < 15
            ) {
                console.log('translate', touch, touch.duration)
                props.slideTranslate(touch.target, touch.startX, touch.startY)
            }

            if (
                touch.duration || 0 > 800 &&
                touch.duration || 0 < 1200 &&
                Math.abs(touch.sumX) < 8 &&
                Math.abs(touch.sumY) < 5
            ) {
                // @ts-ignore
                if (targetActionFilter(e.path || getPath(e.target), 'toolmenu'))
                    props.showToolMenu(touch.target, touch.startX, touch.startY)
            }
        }
        touch.setOnEnd(onTouchEnd)

        const mouseMove = new MouseMove({ button: [2] })
        let preventContextMenu = false;

        mouseMove.setOnEnd((move: MouseMove, e: MouseEvent) => {
            if (
                Math.abs(move.sumX) > 50 &&
                Math.abs(move.sumY) < 15
            ) {
                props.slideTranslate(move.target, move.startX, move.startY)
                preventContextMenu = true
            }

            if (
                move.duration || 0 > 800 &&
                move.duration || 0 < 1200 &&
                Math.abs(move.sumX) < 8 &&
                Math.abs(move.sumY) < 5
            ) {
                // @ts-ignore
                if (targetActionFilter(e.path || getPath(e.target), 'toolmenu')) {
                    props.showToolMenu(touch.target, touch.startX, touch.startY)
                    preventContextMenu = true
                }
            }
        })

        const onContextMenu = (e: MouseEvent) => {
            if (preventContextMenu === true) {
                preventContextMenu = false
                e.preventDefault();
                e.stopPropagation();
                return false
            }
        }

        let scrolling = false
        let timestamp = 0;
        let scrollTop = 0;
        let scrollOffset = 0;
        /**
         * 连续滚动时长超过300ms 触发
         * @param {Event} e 
         */
        const onScroll = function (e: Event) {
            // console.log('-')
            if (scrolling) return;

            scrolling = true;
            setTimeout(() => {
                scrolling = false;
                timestamp = Date.now();
                scrollOffset = document.documentElement.scrollTop - scrollTop
                if (Math.abs(scrollOffset) > 50) {
                    props.setExplShow(false);
                    props.setAShow(false);
                };
            }, 300);

            // console.log(Date.now() - timestamp, e)
            if (Date.now() - timestamp < 20) {
                props.setExplShow(false);
                props.setAShow(false);
            }
            props.hiddenToolMenu();
            scrollTop = document.documentElement.scrollTop;
        }
        const touchEventCapture = true;
        window.addEventListener('click', handleClick, true)
        window.addEventListener('touchstart', touch.start, { capture: touchEventCapture, passive: false });
        window.addEventListener('touchmove', touch.move);
        window.addEventListener('touchend', touch.end);
        window.addEventListener('scroll', onScroll, { capture: touchEventCapture, passive: false });
        window.addEventListener('mousedown', mouseMove.start, true)
        window.addEventListener('mouseup', mouseMove.end, true)
        window.addEventListener('mousemove', mouseMove.move, true)
        window.addEventListener('contextmenu', onContextMenu, true)

        return () => {
            window.removeEventListener('click', handleClick, true);
            // @ts-ignore
            window.removeEventListener('touchstart', touch.start, { capture: touchEventCapture, passive: false });
            window.removeEventListener('touchmove', touch.move);
            window.removeEventListener('touchend', touch.end);
            // @ts-ignore
            window.removeEventListener('scroll', onScroll, { capture: touchEventCapture, passive: false });
            window.removeEventListener('mousedown', mouseMove.start, true)
            window.removeEventListener('mouseup', mouseMove.end, true)
            window.removeEventListener('mousemove', mouseMove.move, true)
            window.removeEventListener('contextmenu', onContextMenu, true)
        }
    }, []);

    return (
        <div ref={rootRef}>
            <Shadow hostEl={rootRef}>
                <>
                    <style>{styles}</style>
                    <div id="wrp-app" data-wrp-action-block="toolmenu" >
                        <div className="wrp-view">
                            <ManageTranslatePanel />
                            <Router>
                                <AModal />
                            </Router>
                            <ToolMenu />
                        </div>
                        <ManageExplanation />
                    </div>
                </>
            </Shadow>
        </div>
    )
}

const mapStateToProps = (state: RootStateOrAny) => ({
});

const mapDispatchToProps = (dispatch: any) => ({
    tapWord: (events: Event) => {
        dispatch(explActions.tapWord(events))
    },
    setExplShow: (show: boolean) => {
        dispatch(explActions.setShow(show))
    },
    setAShow: (isShow: boolean) => {
        dispatch(aActions.setShow(isShow))
    },
    tapA: (a: HTMLAnchorElement) => {
        dispatch(aActions.tapA(a))
    },
    slideTranslate: (target: Element, x: number, y: number) => {
        dispatch(transActions.slideTranslate(target, x, y))
    },
    showToolMenu: (target: Element, x: number, y: number) => {
        dispatch(rpActions.showMenu(target, x, y))
    },
    hiddenToolMenu: () => {
        dispatch(rpActions.hiddenMenu())
    }

})

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    linkIntercept?: boolean
}

export default connector(App);