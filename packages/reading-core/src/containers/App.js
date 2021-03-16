import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';


import * as actions from '../actions/app';
import * as explActions from '../actions/explanation';
import * as transActions from '../actions/translate';
import * as aActions from '../actions/a';
import * as rpActions from '../actions/readPanel';

import ManageExplanation from './ManageExplanation';
import ManageTranslatePanel from './ManageTranslatePanel';
import A from '../components/a';
import AModal from '../components/AModal'
// import { ToolMenu } from '../components/readPanel';
import ToolMenu from './ToolMenu'

import Shadow from './Shadow'


import './App.scss';

import {
    extractPart,
    targetActionFilter,
    linkIntercept,
    getPath,
    scrollToTop
} from '../utils/core';
import Touch, { Tap, MouseMove } from '../utils/touch';

function App(props) {

    const rootRef = useRef()

    const hiddenSomeone = function (name) {
        let names = name.split(' ');
        names.map((name) => {
            switch (name) {
                case "explainPanel":
                    this.props.setExplShow(false);
                    break;
                case "linkDialog":
                    this.props.setAShow(false)
                    break;
                default:
                    break;
            }
        })
    }

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
        const onClick = function (e) {
            // console.log('window onClick e', e)
            // action filter
            if (targetActionFilter(e.path || getPath(e.target), 'tapword'))
                props.tapWord(e);

            // intercept open new page
            linkIntercept(e, props.tapA);
            tap.tap(e);
            props.hiddenToolMenu();
        }

        const touch = new Touch();
        const onTouchStart = function (e) {
            // console.log('window onTouchStart', e)
        }
        touch.setOnStart(onTouchStart)
        const onTouchMove = function (touch, e) {
            // console.log('window onTouchMove', e)
        }
        touch.setOnMoving(onTouchMove)
        const onTouchEnd = function (touch, e) {
            console.log('window onTouchEnd', touch, e)
            if (
                Math.abs(touch.sumX) > 50 &&
                Math.abs(touch.sumY) < 15
            ) {
                console.log('translate', touch)
                props.slideTranslate(touch.target, touch.startX, touch.startY)
            }

            if (
                touch.duration > 800 &&
                touch.duration < 1200 &&
                Math.abs(touch.sumX) < 8 &&
                Math.abs(touch.sumY) < 5
            ) {
                if (targetActionFilter(e.path, 'toolmenu'))
                    props.showToolMenu(touch.target, touch.startX, touch.startY)
            }
        }
        touch.setOnEnd(onTouchEnd)

        const mouseMove = new MouseMove({ button: [2] })
        let preventContextMenu = false;

        mouseMove.setOnEnd((move, e) => {
            if (
                Math.abs(move.sumX) > 50 &&
                Math.abs(move.sumY) < 15
            ) {
                props.slideTranslate(move.target, move.startX, move.startY)
                preventContextMenu = true
            }

            if (
                touch.duration > 800 &&
                touch.duration < 1200 &&
                Math.abs(touch.sumX) < 8 &&
                Math.abs(touch.sumY) < 5
            ) {
                if (targetActionFilter(e.path, 'toolmenu')) {
                    props.showToolMenu(touch.target, touch.startX, touch.startY)
                    preventContextMenu = true
                }
            }
        })

        const onContextMenu = (e) => {
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
         * 
         * @param {*} e 
         */
        const onScroll = function (e) {
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
        window.addEventListener('click', onClick, true)
        // { passive: false }
        window.addEventListener('touchstart', touch.start, { capture: touchEventCapture, passive: false });
        window.addEventListener('touchmove', touch.move);
        window.addEventListener('touchend', touch.end);
        window.addEventListener('scroll', onScroll, { capture: touchEventCapture, passive: false });
        window.addEventListener('mousedown', mouseMove.start, true)
        window.addEventListener('mouseup', mouseMove.end, true)
        window.addEventListener('mousemove', mouseMove.move, true)
        window.addEventListener('contextmenu', onContextMenu, true)

        return () => {
            window.removeEventListener('click', onClick, true);
            window.removeEventListener('touchstart', touch.start, { capture: touchEventCapture, passive: false });
            window.removeEventListener('touchmove', touch.move);
            window.removeEventListener('touchend', touch.end);
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
            </Shadow>
        </div>
    )
}

const mapStateToProps = (state) => ({
    // app: state.app,
    // a: state.a,
    // explShow: state.explanation.show,
    // aShow: state.a.show,
    // toolMenuShow: state,
});

const mapDispatchToProps = (dispatch) => ({
    tapWord: events => {
        dispatch(explActions.tapWord(events))
    },
    setExplShow: show => {
        dispatch(explActions.setShow(show))
    },
    setAShow: isShow => {
        dispatch(aActions.setShow(isShow))
    },
    tapA: a => {
        dispatch(aActions.tapA(a))
    },
    loadXmlDoc: url => {
        console.log(`mapDispatchToProps: input: ${url}`)
        dispatch(actions.loadXmlDoc(url))
    },
    slideTranslate: (target, x, y) => {
        dispatch(transActions.slideTranslate(target, x, y))
    },
    showToolMenu: (target, x, y) => {
        dispatch(rpActions.showMenu(target, x, y))
    },
    hiddenToolMenu: () => {
        dispatch(rpActions.hiddenMenu())
    }

})

export default connect(mapStateToProps, mapDispatchToProps)(App);