import React, { useEffect, useState } from 'react'

import {
    Switch,
    Route,
    useHistory
} from 'react-router-dom'
import { connect } from 'react-redux'

import App, { aActions, webAppAction as actions } from '@wrp/reading-core'

import Home from './Home'

import Status from './status'
import { TrayBar } from './trayBar'
import ExploreApp from '../components/explore'

import './App.scss'
import '../styles/common.scss'

import Head from './Head'
import ReadPanel from './readPanel'

import { replaceScript } from '../utils/help'

function WebApp(props) {
    const history = useHistory()

    const checkURI = () => {
        console.log('webApp.js: checkURI()')

        let urlParams = new URL(window.location.href).searchParams
        let url = urlParams.get('url')
        let key = urlParams.get('key')

        if (key) {
            let doc = localStorage.getItem(key)
            // props.setXmlDoc(doc)
            props.setStatus('parsing')
            props.docParser(doc, null, key)
        }

        let elements = props.elements || []

        if (!url) return

        if (url === props.app.url && elements.length !== 0) {
        }

        if (url === props.app.url && elements.length === 0) {
            // this.props.setStatus('parsing')
            // this.docParser(this.props.app.xmlDoc)
            console.log('checkURI call docParser')
            props.docParser(props.app.xmlDoc, props.app.url)
            // this.props.setLocation('/wrp-read')
        }

        if (url !== props.app.url) {
            // this.inputIsURL = true;
            // if (this.input == url) return;
            props.setUrl(url)
            props.setStatus('loading')
            props.loadXmlDoc(url)
        }
    }

    useEffect(() => {
        props.setHistory(null)
        console.log('history', history)

        history.listen((location) => {
            console.log('🍅 loction: ', location)
            if (props.app.status !== 'loading') {
                checkURI()
            }
        })

        checkURI()

        return () => {}
    }, [])

    useEffect(() => {
        if (localStorage.getItem('script') === 'true') replaceScript()

        // 对页面内js控制的转跳进行重定向
        let location = window.location
        let dir = location.pathname.split('/')[1] // 没有的话返回""

        switch (dir) {
            case '':
                history.push('/wrp-home')
                break
            case 'wrp-read':
            case 'wrp-home':
            case 'wrp-find':
            case 'wrp-word':
            case 'wrp-about':
            case 'wrp-test':
                break
            default:
                console.log('pathname 为 其他路径', dir)
                // js转跳 或是 用户输入的路径
                let origin
                let historyList = props.app.history
                if (!historyList) break
                if (historyList[historyList.length - 1]) {
                    origin = new URL(historyList[historyList.length - 1].input).origin
                    let href = `${
                        location.origin
                    }/wrp-read?url=${encodeURIComponent(
                        origin + location.pathname + location.search
                    )}`
                    console.log(
                        '转跳目标 ->',
                        origin + location.pathname + location.search
                    )
                    window.location.href = href
                } else {
                    origin = window.location.origin + '/wrp-home'
                    console.log('转跳目标', origin)
                    window.location.href = origin
                }

                // alert('转跳！');
                // window.location.pathname = '/wrp-read';
                // window.location.search = `?url=${encodeURIComponent("https://qq.com")}`
                break
        }
    })

    return (
        <>
            {console.log('⛑ webApp render')}
            <Switch>
                <Route path="/">
                    <Switch>
                        <Route exact path="/wrp-home">
                            <Home></Home>
                        </Route>
                        <Route path="/wrp-explore">
                            <ExploreApp></ExploreApp>
                        </Route>
                        <Route path="/wrp-word">
                            <div>
                                <h1>word</h1>
                                <p>开发中...</p>
                            </div>
                        </Route>

                        <Route path="/wrp-word/:id">
                            <div>
                                <input
                                    type="text"
                                    className="form-control input-sm header-search-input  js-site-search-focus "
                                    data-hotkey="s,/"
                                    name="q"
                                    placeholder="Search GitHub"
                                    data-unscoped-placeholder="Search GitHub"
                                    data-scoped-placeholder="Search"
                                    autocapitalize="off"
                                    aria-label="Search GitHub"
                                ></input>

                                <input
                                    style={{ border: '1px solid #000' }}
                                    onInput={() => {
                                        console.log('test entering')
                                    }}
                                ></input>

                                <input
                                    style={{ border: '1px solid #000' }}
                                ></input>
                            </div>
                        </Route>
                        <Route path="/wrp-about">
                            <h1>about</h1>
                            <p>开发中...</p>
                        </Route>
                        <Route path="/wrp-reading">
                            <ReadPanel />
                            <Head></Head>
                            <App></App>
                            <Status />
                        </Route>
                        <Route path="/:name">
                            <ReadPanel />
                            <Head></Head>
                            <App></App>
                            <Status />
                        </Route>
                    </Switch>
                    <TrayBar />
                </Route>
            </Switch>
        </>
    )
}

const mapStateToProps = (state) => ({
    // webApp: state.webApp,
    app: state.app,
})

const mapDispatchToProps = (dispatch) => ({
    setStatus: (status) => {
        dispatch(actions.setStatus(status))
    },

    loadXmlDoc: (url) => {
        console.log(`mapDispatchToProps: input: ${url}`)
        dispatch(actions.loadXmlDoc(url))
    },

    setXmlDoc: (doc) => {
        dispatch(actions.setXmlDoc(doc))
    },

    docParser: (doc, baseUrl, key) => {
        dispatch(actions.docParser(doc, baseUrl, key))
    },

    setHistory: (historyList, item) => {
        dispatch(actions.setHistory(historyList, item))
    },

    setUrl: (url) => {
        dispatch(actions.setUrl(url))
    },

    setAShow: (isShow) => {
        dispatch(aActions.setShow(isShow))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(WebApp)
