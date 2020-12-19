import React, { useState } from 'react';
import { connect } from 'react-redux'
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

import * as actions from './actions/webApp'

import { calcHash } from './utils/core';

import './home.scss';

import logo from './components/res/logo.png';

function ItemCard(props) {
    let data = props.data;
    if (!data) data = {};
    return (
        <Link
            to={`/wrp-read?url=${encodeURIComponent(data.url)}`}
            className="wrp-card-wrapper wrp-cp"
            data-url={data.url}
            data-key={data.key}
        >
            <div className="wrp-image-wrapper wrp-card-image">
                <img className="wrp-image" src={data.icon}></img>
            </div>
            <div className="wrp-card-text-wrapper">
                <div className="wrp-ellipsis wrp-ct">{data.title}</div>
                <div className="wrp-cs">{data.des}</div>
            </div>
        </Link>
    )
}

function History(props) {
    let List = [];
    if (!props.readHistory) return List;
    if (!Array.isArray(props.readHistory)) {
        console.warn('Home.js History(props), props.readHistory is not an Array.')
        return List;
    }
    for (let i of props.readHistory) {
        List.unshift(
            <ItemCard
                key={i.url || i.key}
                data={i}
            ></ItemCard>
        )
    }
    return List;
}

function Home(props) {
    const [focused, setFocused] = useState(false);
    const [input, setInput] = useState('');

    const urlPattern = /^https?:\/\/(.+\.\w+.*)|(localhost.*)/;

    const onKeyUp = (e) => {
        if (e.key == "Enter") {
            go();
        }
    }

    const onChange = (e) => {
        // console.log('onChange');
        setInput(e.currentTarget.value)
    }

    const onPaste = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // console.log('onPaste');
        let copiedText = e.clipboardData.getData('text/plain');
        let copiedRichText = e.clipboardData.getData('text/html');
        if (!copiedRichText || copiedRichText.length <= copiedText.length) {
            setInput(copiedText)
        } else {
            // 如果粘贴的不是url, 则尝试获取富文本
            setInput(copiedRichText);
        }
    }

    const go = () => {
        let isUrl = input.length < 10000 && urlPattern.test(input);

        if (isUrl) {
            return readFromUrl(input);
        }

        let key = String(calcHash(input));
        localStorage.setItem(key, input);
        readFromText(key, input);
    }

    const readFromUrl = (url) => {
        if (url === props.webApp.url) {
            props.setStatus('parsing')
            props.setLocation('/wrp-read')
        } else {
            props.setUrl(url)
            props.setKey('')
            props.setStatus('loading')
            props.loadXmlDoc(url)
            props.setLocation('/wrp-read')
        }

        // 转跳至 /wrp-read
        props.history.push({
            pathname: '/wrp-read',
            search: `?url=${url}`
        })
    }

    const readFromText = (key, value = '') => {
        if (!value) value = localStorage.getItem(key)
        props.setKey(key)
        // props.setXmlDoc(value)
        props.setStatus('parsing')
        props.docParser(value, null, key);
        props.setUrl('')
        props.setLocation('/wrp-read')

        // 转跳至 /wrp-read
        props.history.push({
            pathname: '/wrp-read',
            search: `?key=${key}`
        })
    }

    return (
        <div className="wrp-page">
            <div className="wrp-app-logo-container">
                <img className="wrp-app-logo" src={logo} />
                <h1 class="wrp-app-logo-title" style={{ display: 'none' }}>Word Reading Beta</h1>
            </div>
            <div className={"wrp-input-container ".concat(focused ? "focused" : "")}>
                <div className="wrp-input-bar">
                    {focused ? (
                        <div
                            className="wrp-input-bar-button"
                            onClick={() => setFocused(false)}
                        >
                            <svg viewBox="0 0 1118 1024" version="1.1" width="218.359375" height="200" fill="var(--c-dark)"><defs><style type="text/css"></style></defs><path d="M229.42 558.545h841.125c25.707 0 46.546-20.839 46.546-46.545 0-25.706-20.84-46.545-46.546-46.545H229.42L544.913 149.96c18.177-18.177 18.177-47.648 0-65.825-18.178-18.177-47.648-18.177-65.826 0L84.137 479.087c-9.09 9.089-13.634 21.001-13.634 32.913 0 11.912 4.545 23.824 13.633 32.913l394.951 394.95c18.178 18.178 47.648 18.178 65.826 0 18.177-18.176 18.177-47.647 0-65.824L229.419 558.545z" p-id="5564"></path></svg>
                        </div>
                    ) : ''}
                    <input
                        className={"wrp-input ".concat(focused ? "wrp-input-focused" : "")}
                        id="wrp-home-input"
                        autoComplete="on"
                        contentEditable="true"
                        onChange={onChange}
                        onKeyUp={onKeyUp}
                        onPaste={onPaste}
                        onFocus={() => setFocused(true)}
                        type="text"
                        placeholder="输入文章或链接"
                        value={input}
                    ></input>
                    {focused ? (
                        <div
                            className="wrp-input-bar-button wb-clearinput"
                            onClick={() => setInput('')}
                        >
                            <svg viewBox="0 0 1024 1024" version="1.1" width="200" height="200" fill="var(--c-dark)"><defs><style type="text/css"></style></defs><path d="M512 0a512 512 0 0 0-512 512 512 512 0 0 0 512 512 512 512 0 0 0 512-512 512 512 0 0 0-512-512z m241.005714 703.268571a32.182857 32.182857 0 0 1 0.512 45.348572 32.182857 32.182857 0 0 1-45.348571 0.512L512 556.763429 315.830857 748.982857a31.963429 31.963429 0 1 1-44.836571-45.787428L466.285714 512l-195.291428-191.268571a32.182857 32.182857 0 0 1-0.512-45.348572 32.182857 32.182857 0 0 1 45.348571-0.512L512 467.236571 708.169143 275.017143a31.963429 31.963429 0 1 1 44.836571 45.787428L557.714286 512l195.291428 191.268571z" p-id="10064"></path></svg>
                        </div>
                    ) : ''}
                    <div className="wrp-input-bar-go" onClick={go}>
                        <svg viewBox="0 0 218.36 200"><path fill="var(--c-light)" d="M187.14,109.09l-61.62,61.62a9.09,9.09,0,0,0,12.86,12.86l77.14-77.14a9.1,9.1,0,0,0,0-12.86L138.38,16.43a9.09,9.09,0,1,0-12.86,12.86l61.62,61.62H22.86a9.09,9.09,0,1,0,0,18.18Z" /></svg>
                    </div>
                </div>

            </div>
            <div>
                <History readHistory={props.readHistory}></History>
            </div>
            <div>
                {/**推荐文章 */}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    readHistory: state.webApp.history,
    webApp: state.webApp,
    app: state.app,
})

const mapDispatchToProps = (dispatch) => ({
    goRead: (input, currentUrl) => {
        dispatch(actions.goRead(input, currentUrl))
    },
    setUrl: url => {
        dispatch(actions.setUrl(url))
    },
    setKey: key => {
        dispatch(actions.setKey(key))
    },
    loadXmlDoc: (url) => {
        dispatch(actions.loadXmlDoc(url))
    },
    setStatus: status => {
        dispatch(actions.setStatus(status))
    },
    setLocation: location => {
        dispatch(actions.setLocation(location))
    },
    setXmlDoc: xmlDoc => {
        dispatch(actions.setXmlDoc(xmlDoc))
    },
    docParser: (doc, baseUrl, key) => {
        dispatch(actions.docParser(doc, baseUrl, key))
    }
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
export { ItemCard }



// 废弃
class _Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // ReactRouter_DeclarativeRoutingForReact.js.html
            // https://github.com/reactjs/react-router-tutorial/tree/master/lessons/08-index-routes 
            // 点击Next: Index Links 中的非文字部分，不弹出转跳框
            input: 'https://',  //  paste.html   Golden_swallow-Wiki.html   wikipedia-1.html
            typing: false,

        };
        this.urlPattern = /^https?:\/\/(.+\.\w+.*)|(localhost.*)/;
        this.jumpChange = 0;
    }

    handleChange(e) {
        if (this.jumpChange >= 1) {
            // console.log('change jump', e, e.currentTarget.value);
            this.jumpChange -= 1;
            return '';
        };
        // console.log('change', e, e.currentTarget.value);
        let input = e.currentTarget.value;
        if (this.state.input != input) {
            // console.log('setState')
            this.setState({
                input: input
            })
        }
    }

    handlePaste(e) {
        console.log('paste', e.clipboardData.getData('text/plain'), e.clipboardData.getData('text/html'));
        let pasteText = e.clipboardData.getData('text/plain');
        if (this.urlPattern.test(pasteText)) {
            // 粘贴的为url, 不进行操作
        } else {
            // 如果粘贴的不是url, 则尝试获取富文本
            let pasteHtml = e.clipboardData.getData('text/html');
            let input = this.state.input;
            if (pasteHtml != '' && input == '') {
                console.log('获取html', input + pasteHtml);
                if (this.state.input != pasteHtml) {
                    this.jumpChange += 1;
                    this.setState({
                        input: input + pasteHtml
                    })
                }
                // e.currentTarget.value = pasteHtml;
                // this.input = pasteHtml;
            }
        }
    }

    goRead() {
        console.log(`home.js goRead: ${this.state.input} url: ${this.props.webApp.url}`)

        let input = this.state.input

        let a = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/

        let urlPattern = /^http(s)?:\/\/\w{0,62}(\.?\w{0,62})+\.\w{1,62}([:\/].*)*$/
        let isUrl = input.length < 10000 ? urlPattern.test(input) : false

        if (isUrl) {
            this.readFromUrl(input)
        } else {
            const getHash = (s) => {
                return s.split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
            }
            const t1 = new Date()
            let key = String(getHash(input))
            const t2 = new Date()
            console.log('getHash: time', t2 - t1, key)
            localStorage.setItem(key, input)
            this.readFromText(key, input)
        }

    }

    readFromUrl(url) {
        if (url === this.props.webApp.url) {
            this.props.setStatus('parsing')
            this.props.setLocation('/wrp-read')
        } else {
            this.props.setUrl(url)
            this.props.setKey('')
            this.props.setStatus('loading')
            this.props.loadXmlDoc(url)
            this.props.setLocation('/wrp-read')
        }
        // 转跳至 /wrp-read
        this.props.history.push({
            pathname: '/wrp-read',
            search: `?url=${url}`
        })
    }

    readFromText(key, value = '') {
        if (!value) value = localStorage.getItem(key)
        this.props.setKey(key)
        this.props.setXmlDoc(value)
        this.props.setUrl('')
        this.props.setStatus('parsing')
        this.props.setLocation('/wrp-read')

        // 转跳至 /wrp-read
        this.props.history.push({
            pathname: '/wrp-read',
            search: `?key=${key}`
        })
    }

    onClickCard(e) {
        e.preventDefault()
        console.log(`e : ${e}`, e, e.currentTarget.dataset.input)
        let url = e.currentTarget.dataset.url
        let key = e.currentTarget.dataset.key
        if (key) this.readFromText(key)
        if (url) this.readFromUrl(url)

    }

    handleKeyUp(e) {
        console.log('handleKeyUp', e)
        if (e.key == "Enter") {
            this.goRead();
        }
    }

    setTyping(value) {
        if (this.state.typing == value) return;
        this.setState({
            typing: value
        })
    }

    setInput(value, focus) {
        console.log('setInput', value, focus)
        if (focus) {
            document.getElementById('whinput').focus();
        }
        if (typeof (value) !== 'string') return;
        if (this.state.input == value) return;
        this.setState({
            input: value,
        })
    }

    createHistory() {
        let readHistory = this.props.readHistory;
        // console.log('createHistory', readHistory);
        if (!readHistory) return [];
        let history = [];
        for (let i in readHistory) {
            // console.log('i loog',i);
            history.unshift(<ItemCard
                data={readHistory[i]}
                onClick={(e) => this.onClickCard(e)}
            ></ItemCard>)
        }
        // console.log('createHistory - a', history);
        this.history = this.props.readHistory;
        return history;
    }

    render() {
        let typing = this.state.typing;
        let history = this.createHistory();

        return (<div className="wrp-page">
            <div className="wrp-app-logo-container">
                <img className="wrp-app-logo" src={logo} />
                {/*<h1 class="wrp-app-logo-title">Word Reading Pro</h1>*/}
            </div>
            <div className={"wrp-input-container ".concat(typing ? "typing" : "")}>
                <div className="wrp-input-bar">
                    {typing ? (<div className="wrp-input-bar-button" onClick={() => this.setTyping(false)}>
                        <svg viewBox="0 0 1118 1024" version="1.1" width="218.359375" height="200" fill="var(--c-dark)"><defs><style type="text/css"></style></defs><path d="M229.42 558.545h841.125c25.707 0 46.546-20.839 46.546-46.545 0-25.706-20.84-46.545-46.546-46.545H229.42L544.913 149.96c18.177-18.177 18.177-47.648 0-65.825-18.178-18.177-47.648-18.177-65.826 0L84.137 479.087c-9.09 9.089-13.634 21.001-13.634 32.913 0 11.912 4.545 23.824 13.633 32.913l394.951 394.95c18.178 18.178 47.648 18.178 65.826 0 18.177-18.176 18.177-47.647 0-65.824L229.419 558.545z" p-id="5564"></path></svg>
                    </div>) : ''}
                    <input
                        className={"wrp-input ".concat(typing ? "wrp-input-typing" : "")}
                        id="whinput"
                        autoComplete="on"
                        contentEditable="true"
                        onChange={(e) => this.handleChange(e)}
                        onKeyUp={(e) => this.handleKeyUp(e)}
                        onPaste={(e) => { this.handlePaste(e); }}
                        onFocus={() => this.setTyping(true)}
                        type="text"
                        placeholder="输入文章或链接"
                        value={this.state.input}
                    ></input>
                    {typing ? (<div className="wrp-input-bar-button wb-clearinput" onClick={() => { this.setInput('', true) }}>
                        <svg viewBox="0 0 1024 1024" version="1.1" width="200" height="200" fill="var(--c-dark)"><defs><style type="text/css"></style></defs><path d="M512 0a512 512 0 0 0-512 512 512 512 0 0 0 512 512 512 512 0 0 0 512-512 512 512 0 0 0-512-512z m241.005714 703.268571a32.182857 32.182857 0 0 1 0.512 45.348572 32.182857 32.182857 0 0 1-45.348571 0.512L512 556.763429 315.830857 748.982857a31.963429 31.963429 0 1 1-44.836571-45.787428L466.285714 512l-195.291428-191.268571a32.182857 32.182857 0 0 1-0.512-45.348572 32.182857 32.182857 0 0 1 45.348571-0.512L512 467.236571 708.169143 275.017143a31.963429 31.963429 0 1 1 44.836571 45.787428L557.714286 512l195.291428 191.268571z" p-id="10064"></path></svg>
                    </div>) : ''}
                    <div className="wrp-input-bar-go" onClick={() => { this.goRead() }}>
                        <svg viewBox="0 0 218.36 200"><path fill="var(--c-light)" d="M187.14,109.09l-61.62,61.62a9.09,9.09,0,0,0,12.86,12.86l77.14-77.14a9.1,9.1,0,0,0,0-12.86L138.38,16.43a9.09,9.09,0,1,0-12.86,12.86l61.62,61.62H22.86a9.09,9.09,0,1,0,0,18.18Z" /></svg>
                    </div>
                </div>

            </div>
            <div>
                {history}
            </div>
            <div>
                {/**推荐文章 */}
            </div>
        </div>
        );
    }
}