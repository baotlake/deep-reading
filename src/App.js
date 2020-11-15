import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import * as actions from './actions/app';
import * as explActions from './actions/explanation';
import * as transActions from './actions/translate';
import * as aActions from './actions/a';
import * as rpActions from './actions/readPanel';

import ReactDOM from 'react-dom';

// import {
//     Link,
//     withRouter,
// } from 'react-router-dom'

import './App.scss';

import ManageExplanation from './containers/ManageExplanation';
import TranslatePanel from './containers/TranslatePanel';
import A, { AModal } from './components/a';
import { ToolMenu } from './components/readPanel';

import { extractPart, targetActionFilter, linkIntercept } from './utils/core';
import Touch from './utils/touch';

function App(props) {

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
            }
        })
    }


    useEffect(() => {

        const onClick = function (e) {
            console.log('window onClick e', e)
            // action filter
            if (targetActionFilter(e.path, 'tapword'))
                props.tapWord(e);

            linkIntercept(e, props.tapA);
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
                touch.duration < 2000 &&
                touch.sumX < 15 &&
                touch.sumY < 15
            ) {
                if (targetActionFilter(e.path, 'toolmenu'))
                    props.showToolMenu(touch.target, touch.startX, touch.startY)
            }

        }

        touch.setOnEnd(onTouchEnd)

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
            scrollTop = document.documentElement.scrollTop;
        }

        window.addEventListener('click', onClick, true)
        // { passive: false }
        window.addEventListener('touchstart', touch.start, { capture: true, passive: false });
        window.addEventListener('touchmove', touch.move);
        window.addEventListener('touchend', touch.end);
        window.addEventListener('scroll', onScroll, { capture: true, passive: false });

        return () => {
            window.removeEventListener('click', onClick, true);
            window.removeEventListener('touchstart', touch.start, { capture: true, passive: false });
            window.removeEventListener('touchmove', touch.move);
            window.removeEventListener('touchend', touch.end);
            window.removeEventListener('scroll', onScroll, { capture: true, passive: false });
        }
    }, []);

    return (
        <>
            <div id="wrp-app" data-wrp-action-block="toolmenu" >
                <div className="wrp-view">
                    <TranslatePanel />
                    <AModal />
                    <ToolMenu />
                </div>
                <ManageExplanation />
            </div>
        </>
    )
}

const mapStateToProps = (state) => ({
    app: state.app,
    a: state.a
});

const mapDispatchToProps = (dispatch) => ({
    setStatus: (status) => {
        dispatch(actions.setStatus(status))
    },
    setHistory: (item) => {
        dispatch(actions.setHistory(item))
    },
    setXmlDoc: xmlDoc => {
        dispatch(actions.setXmlDoc(xmlDoc))
    },
    tapWord: events => {
        dispatch(explActions.tapWord(events))
    },
    loadWordData: word => {
        dispatch(explActions.loadWordData(word))
    },
    setExplShow: show => {
        dispatch(explActions.setShow(show))
        // dispatch(explActions.setSetting({ show: false }))
        // dispatch(explActions.setMore([]))
        // dispatch(explActions.setMoreFold(false))
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
    setUrl: url => {
        dispatch(actions.setUrl(url))
    },

    slideTranslate: (target, x, y) => {
        dispatch(transActions.slideTranslate(target, x, y))
    },

    showToolMenu: (target, x, y) => {
        dispatch(rpActions.showMenu(target, x, y))
    },

})

export default connect(mapStateToProps, mapDispatchToProps)(App);