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

import * as actions from '../actions/webApp'

import { calcHash } from '../utils/core';

import './home.scss';

import logo from '../components/res/logo.png';

import ItemCard from '../components/home/ItemCard.tsx'
import History from '../components/home/History.tsx'

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
                    {/* <input type="file"></input> */}
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
                        placeholder="贴入文章或链接"
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
            <div className="wrp-card-container">
                <History data={props.readHistory}></History>
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