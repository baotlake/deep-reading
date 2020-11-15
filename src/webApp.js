import React from 'react';
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
import Home from './Home';
import Status from './Status';
import './common.scss';

import { NavBar } from './components/navBar';
import FindPage from './components/findPage';

import { store } from './index'
import * as actions from './actions/webApp'
import * as aActions from './actions/a';

import { connect } from 'react-redux'

import Head from './Head';
import ReadPanel from './components/readPanel';

import { replaceScript } from './utils/core'

class WebApp extends React.Component {
    constructor(props) {
        console.log(`store: ${JSON.stringify(store)}`)
        super(props);
        this.input = "";
        this.urlPattern = /^https?:\/\/(.+\.\w+.*)|(localhost.*)/;
        // 初始化History
        this.props.setHistory(null)
    }

    go(input, isUri) {
        console.log("webApp.js: go() ", input, isUri);

        // 当前网页
        if (input == this.input) {
            console.log('input = this.input 跳过加载')
            this.props.setStatus('parsing')
            //当前阅读的页面，跳过加载，直接渲染
            return;
        }

        // 复制粘贴富文本
        if (!isUri) {
            this.props.setXmlDoc(input);
            this.props.setStatus('parsing')
            return;
        }

        // 新网页，加载
        this.input = input;
        this.inputIsURL = isUri;

        this.props.setStatus('loading')
        this.props.loadXmlDoc(input)
    }

    checkURI() {
        console.log('webApp.js: checkURI()');

        let urlParams = (new URL(window.location.href)).searchParams;
        let url = urlParams.get('url');
        let key = urlParams.get('key');

        if (key) {
            let doc = localStorage.getItem(key);
            this.props.setXmlDoc(doc)
            this.props.setStatus('parsing')
        }

        // if (url) {
        //     this.inputIsURL = true;
        //     if (this.input == url) return;
        //     this.input = url;
        //     this.props.setStatus('loading')
        //     this.props.loadXmlDoc(url)
        // }

        let elements = this.props.elements || []

        if (!url) return;

        if (url === this.props.app.url && elements.length !== 0) {

        }

        if (url === this.props.app.url && elements.length === 0) {
            // this.props.setStatus('parsing')
            // this.docParser(this.props.app.xmlDoc)
            console.log('checkURI call docParser')
            this.props.docParser(this.props.app.xmlDoc, this.props.app.url)
            // this.props.setLocation('/wrp-read')
        }

        if (url !== this.props.app.url) {
            this.inputIsURL = true;
            if (this.input == url) return;
            this.props.setUrl(url)
            this.props.setStatus('loading')
            this.props.loadXmlDoc(url)
        }
    }

    // checkURI() {
    //     console.log('webApp.js: checkURI()');

    //     let urlParams = (new URL(window.location.href)).searchParams;
    //     let url = urlParams.get('url');
    //     let key = urlParams.get('key');

    //     if (key) {
    //         let doc = localStorage.getItem(key);
    //         // this.props.setXmlDoc(doc)
    //         this.props.docParser(doc, '', key)
    //     }

    //     let elements = this.props.elements || []

    //     if (url === this.props.app.url && elements.length !== 0) {

    //     }

    //     if (url === this.props.app.url && elements.length === 0) {
    //         // this.props.setStatus('parsing')
    //         // this.docParser(this.props.app.xmlDoc)
    //         console.log('checkURI call docParser')
    //         this.props.docParser(this.props.app.xmlDoc, this.props.app.url)
    //         // this.props.setLocation('/wrp-read')
    //     }

    //     if (url !== this.props.app.url) {
    //         this.inputIsURL = true;
    //         if (this.input == url) return;
    //         this.props.setUrl(url)
    //         this.props.setStatus('loading')
    //         this.props.loadXmlDoc(url)
    //     }
    //     this.props.setAShow(false)
    //     this.props.setExplShow(false)

    // }

    componentWillUnmount() {

    }

    componentDidMount() {
        console.log('webApp.js: componentWillMount');
        console.log(`store: ${JSON.stringify(store)}`)
        this.componentDidUpdate();

        this.props.history.listen(location => {
            console.log('history.listen', location, window.location)
            let url = new URLSearchParams(window.location.search).get('url')
            if (this.props.app.status !== 'loading') {
                this.checkURI()
            }
        })

        this.checkURI()
    }

    componentDidUpdate() {
        replaceScript();

        // 手动触发 DOMContentLoaded
        var DOMContentLoaded_event = document.createEvent("Event");
        DOMContentLoaded_event.initEvent("DOMContentLoaded", true, true);
        window.document.dispatchEvent(DOMContentLoaded_event)

        console.log('webApp.js: componentDidUpdate', window.location);

        // 对页面内js控制的转跳进行重定向
        let location = window.location;
        let dir = location.pathname.split("/")[1]; // 没有的话返回""
        switch (dir) {
            case "":
                this.props.history.push('/wrp-home');
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
                let newSearch = `?url=${encodeURIComponent(this.input + location.pathname + location.search)}`;
                let origin;
                let history = this.props.app.history
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

    }

    render() {
        console.log('webApp.js: render()');
        console.log(`store: ${JSON.stringify(store)}`)

        let Page = (
            <>
                <Switch>
                    <Route path="/" >
                        <Switch>
                            <Route exact path="/wrp-home">
                                <Home
                                    setInput={(input, type) => this.go(input, type)}
                                ></Home>
                            </Route>
                            <Route path="/wrp-find" >
                                <FindPage></FindPage>
                            </Route>
                            <Route path="/wrp-word" >
                                <div>
                                    <h1>a {JSON.stringify({ ...this.props.a })}</h1>
                                    <h2>APP: {JSON.stringify({})}</h2>
                                    <button
                                        onClick={this.props.testAction}>action</button>
                                </div>
                            </Route>
                            <Route
                                path="/wrp-word/:id"
                            >
                                <div>
                                    <input type="text" className="form-control input-sm header-search-input  js-site-search-focus " data-hotkey="s,/" name="q" placeholder="Search GitHub" data-unscoped-placeholder="Search GitHub" data-scoped-placeholder="Search" autocapitalize="off" aria-label="Search GitHub"></input>

                                    <input style={{ "border": "1px solid #000" }} onInput={() => { console.log('test entering') }}></input>

                                    <input style={{ "border": "1px solid #000" }} ></input>
                                </div>
                            </Route>
                            <Route path="/:name">
                                <ReadPanel
                                    padding={!this.props.url}
                                    content={this.props.app.elements}
                                />
                                <Head></Head>
                                <App></App>
                                {
                                    // this.showStatus()
                                }
                                <Status
                                    url={this.input}
                                />
                            </Route>
                        </Switch>
                        {/* <NavBar path={this.props.path} /> */}
                    </Route>
                </Switch>
            </>
        );

        return Page;
    }
}


const mapStateToProps = (state) => ({
    webApp: state.webApp,
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
