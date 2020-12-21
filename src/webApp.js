import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useLocation,
    useRouteMatch,
    useParams,
    useHistory,
    withRouter,

} from 'react-router-dom';
import './webApp.scss';

import App from './App';
// import {AppWithRouter as App} from './App';
import Home from './home';
import Status from './status';
import './common.scss';

import { TrayBar } from './components/trayBar';
import ExploreApp from './components/explore';

import { store } from './index'
import * as actions from './actions/webApp'
import * as aActions from './actions/a';

import { connect } from 'react-redux'

import Head from './head';
import ReadPanel from './components/readPanel';

import { replaceScript } from './utils/core'

function WebApp(props) {

    const checkURI = () => {
        console.log('webApp.js: checkURI()');

        let urlParams = (new URL(window.location.href)).searchParams;
        let url = urlParams.get('url');
        let key = urlParams.get('key');

        if (key) {
            let doc = localStorage.getItem(key);
            // props.setXmlDoc(doc)
            props.setStatus('parsing')
            props.docParser(doc, null, key)
        }

        let elements = props.elements || []

        if (!url) return;

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
        props.setHistory(null);

        props.history.listen(location => {
            if (props.app.status !== 'loading') {
                checkURI()
            }
        })

        checkURI();

    }, []);

    useEffect(() => {
        replaceScript();

        // 对页面内js控制的转跳进行重定向
        let location = window.location;
        let dir = location.pathname.split("/")[1]; // 没有的话返回""
        switch (dir) {
            case "":
                props.history.push('/wrp-home');
                break
            case "wrp-read":
            case "wrp-home":
            case "wrp-find":
            case "wrp-word":
            case "wrp-about":
            case "wrp-test":
                break;
            default:
                console.log("pathname 为 其他路径", dir);
                // js转跳 或是 用户输入的路径
                let origin;
                let history = props.app.history
                if (!history) break
                if (history[history.length - 1]) {
                    origin = new URL(history[history.length - 1].input).origin;
                    let href = `${location.origin}/wrp-read?url=${encodeURIComponent(origin + location.pathname + location.search)}`;
                    console.log('转跳目标 ->', origin + location.pathname + location.search)
                    window.location.href = href;
                } else {
                    origin = window.location.origin + "/wrp-home";
                    console.log('转跳目标', origin);
                    window.location.href = origin;
                }

                // alert('转跳！');
                // window.location.pathname = '/wrp-read';
                // window.location.search = `?url=${encodeURIComponent("https://qq.com")}`
                break;
        }

    });

    return (
        <>
            { console.log('⛑ webApp render')}
            <Switch>
                <Route path="/" >
                    <Switch>
                        <Route exact path="/wrp-home">
                            <Home></Home>
                        </Route>
                        <Route path="/wrp-explore" >
                            <ExploreApp></ExploreApp>
                        </Route>
                        <Route path="/wrp-word" >
                            <div>
                                <h1>word</h1>
                                <p>开发中...</p>
                            </div>
                        </Route>
 
                        <Route path="/wrp-word/:id">
                            <div>
                                <input type="text" className="form-control input-sm header-search-input  js-site-search-focus " data-hotkey="s,/" name="q" placeholder="Search GitHub" data-unscoped-placeholder="Search GitHub" data-scoped-placeholder="Search" autocapitalize="off" aria-label="Search GitHub"></input>

                                <input style={{ "border": "1px solid #000" }} onInput={() => { console.log('test entering') }}></input>

                                <input style={{ "border": "1px solid #000" }} ></input>
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

    loadXmlDoc: url => {
        console.log(`mapDispatchToProps: input: ${url}`)
        dispatch(actions.loadXmlDoc(url))
    },

    setXmlDoc: doc => {
        dispatch(actions.setXmlDoc(doc))
    },

    docParser: (doc, baseUrl, key) => {
        dispatch(actions.docParser(doc, baseUrl, key))
    },

    setHistory: (historyList, item) => {
        dispatch(actions.setHistory(historyList, item))
    },

    setUrl: url => {
        dispatch(actions.setUrl(url))
    },

    setAShow: isShow => {
        dispatch(aActions.setShow(isShow))
    },
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WebApp));
