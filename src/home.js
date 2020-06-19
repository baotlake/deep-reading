import React from 'react';
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

import './home.css';

import logo from './components/res/logo.png';

function itemCard(data){
    if(!data) return '';
    return (
        <div className="wrp-card-wrapper wrp-cp" onClick={()=>{}}>
            <div className="wrp-image-wrapper wrp-card-image">
                <img className="wrp-image" src={data.icon}></img>
            </div>
            <div className="wrp-card-text-wrapper">
                <div className="wrp-ellipsis wrp-ct">{data.title}</div>
                <div className="wrp-cs">{data.des}</div>
            </div>
        </div>
    )
}

function ItemCard(props){
    /**props.data = {icon:'src',title:'title',des:'description'} */
    let data = props.data;
    if(!data) data = {};
    return (
        <div 
            className="wrp-card-wrapper wrp-cp"
            onClick={props.onClick}
        >
            <div className="wrp-image-wrapper wrp-card-image">
                <img className="wrp-image" src={data.icon}></img>
            </div>
            <div className="wrp-card-text-wrapper">
                <div className="wrp-ellipsis wrp-ct">{data.title}</div>
                <div className="wrp-cs">{data.des}</div>
            </div>
        </div>
    )
}


class Home extends React.Component{
    constructor(props){
        super(props);
        this.state={
            // ReactRouter_DeclarativeRoutingForReact.js.html
            // https://github.com/reactjs/react-router-tutorial/tree/master/lessons/08-index-routes 
            // 点击Next: Index Links 中的非文字部分，不弹出转跳框
            input: 'https://',  //  paste.html   Golden_swallow-Wiki.html   wikipedia-1.html
            typing:false,

        };
        this.urlPattern = /^https?:\/\/(.+\.\w+.*)|(localhost.*)/;
        this.jumpChange = 0;
        this.history = null;
    }

    handleChange(e){
        if(this.jumpChange >= 1){
            // console.log('change jump', e, e.currentTarget.value);
            this.jumpChange -= 1;
            return '';
        };
        // console.log('change', e, e.currentTarget.value);
        let input = e.currentTarget.value;
        if(this.state.input != input){
            // console.log('setState')
            this.setState({
                input:input
            })
        }
    }

    handlePaste(e){
        console.log('paste', e.clipboardData.getData('text/plain'),e.clipboardData.getData('text/html'));
        let pasteText = e.clipboardData.getData('text/plain');
        if(this.urlPattern.test(pasteText)){
            // 粘贴的为url, 不进行操作
        }else{
            // 如果粘贴的不是url, 则尝试获取富文本
            let pasteHtml = e.clipboardData.getData('text/html');
            let input = this.state.input;
            if(pasteHtml != '' && input == ''){
                console.log('获取html', input + pasteHtml);
                if(this.state.input != pasteHtml){
                    this.jumpChange += 1;
                    this.setState({
                        input:input + pasteHtml
                    })
                }
                // e.currentTarget.value = pasteHtml;
                // this.input = pasteHtml;
            }
        }
    }

    inputGo(input){
        console.log('input go', input);
        if(!input) input = this.state.input;
        let inputIsURL = input.length < 2000 ? this.urlPattern.test(input) : false;

        if(input == '') return;

        try{
            console.log('props.setInput');
            this.props.setInput(input, inputIsURL)
        }catch(e){
            console.error('home.js need props setInput is function', e);
        }

        // URL转跳
        if(inputIsURL){
            this.props.history.push({
                pathname:'/wrp-read',
                search : `?url=${encodeURIComponent(input)}`
            })
        }else{
            this.props.history.push({
                pathname:'/wrp-read',
                // search : `?url=${encodeURIComponent('input')}`
            }) 
        }
        
    }

    handleKeyUp(e){
        // console.log('handleKeyUp',e)
        if(e.key == "Enter"){
            this.inputGo();
        }
    }


    setTyping(value){
        if(this.state.typing == value) return;
        this.setState({
            typing:value
        })
    }

    setInput(value,focus){
        console.log('setInput', value,focus)
        if(focus){
            document.getElementById('whinput').focus();
        }
        if(typeof(value) !== 'string') return;
        if(this.state.input == value) return;
        this.setState({
            input:value,
        })
    }

    createHistory(){
        let readHistory = this.props.readHistory;
        console.log('createHistory', readHistory);
        if(!readHistory) return [];
        let history = [];
        for(let i = readHistory.length - 1; i >= 0; i--){
            console.log('i loog', readHistory[i]);
            history.push(<ItemCard 
                data={readHistory[i]} 
                onClick={()=>{this.inputGo(readHistory[i].input);}}
            ></ItemCard>)
        }
        console.log('createHistory - a', history);
        this.history = this.props.readHistory;
        return history;
    }

    render(){
        let typing = this.state.typing;
        let history = this.createHistory();

        return(<div className="wrp-page">
                    <div className="wrp-app-logo-container">
                        <img className="wrp-app-logo" src={logo} />
                        {/*<h1 class="wrp-app-logo-title">Word Reading Pro</h1>*/}
                    </div>
                    <div className={"wrp-input-container ".concat(typing ? "typing":"")}>
                        <div className="wrp-input-bar">
                            {typing ? (<div className="wrp-input-bar-button" onClick={()=>this.setTyping(false)}>
                                <svg viewBox="0 0 1118 1024" version="1.1" width="218.359375" height="200" fill="var(--c-dark)"><defs><style type="text/css"></style></defs><path d="M229.42 558.545h841.125c25.707 0 46.546-20.839 46.546-46.545 0-25.706-20.84-46.545-46.546-46.545H229.42L544.913 149.96c18.177-18.177 18.177-47.648 0-65.825-18.178-18.177-47.648-18.177-65.826 0L84.137 479.087c-9.09 9.089-13.634 21.001-13.634 32.913 0 11.912 4.545 23.824 13.633 32.913l394.951 394.95c18.178 18.178 47.648 18.178 65.826 0 18.177-18.176 18.177-47.647 0-65.824L229.419 558.545z" p-id="5564"></path></svg>
                            </div>):''}
                            <input
                                className={"wrp-input ".concat(typing ? "wrp-input-typing":"")}
                                id="whinput"
                                autoComplete="on"
                                contentEditable="true" 
                                onChange={(e)=>this.handleChange(e)}
                                onKeyUp={(e)=>this.handleKeyUp(e)}
                                onPaste={(e)=>{this.handlePaste(e);}}
                                onFocus={()=>this.setTyping(true)}
                                type="text"
                                placeholder="输入文章或链接"
                                value={this.state.input}
                            ></input>
                            {typing?(<div className="wrp-input-bar-button wb-clearinput" onClick={()=>{this.setInput('', true)}}> 
                                <svg viewBox="0 0 1024 1024" version="1.1" width="200" height="200" fill="var(--c-dark)"><defs><style type="text/css"></style></defs><path d="M512 0a512 512 0 0 0-512 512 512 512 0 0 0 512 512 512 512 0 0 0 512-512 512 512 0 0 0-512-512z m241.005714 703.268571a32.182857 32.182857 0 0 1 0.512 45.348572 32.182857 32.182857 0 0 1-45.348571 0.512L512 556.763429 315.830857 748.982857a31.963429 31.963429 0 1 1-44.836571-45.787428L466.285714 512l-195.291428-191.268571a32.182857 32.182857 0 0 1-0.512-45.348572 32.182857 32.182857 0 0 1 45.348571-0.512L512 467.236571 708.169143 275.017143a31.963429 31.963429 0 1 1 44.836571 45.787428L557.714286 512l195.291428 191.268571z" p-id="10064"></path></svg>
                            </div>):''}
                            <div className="wrp-input-bar-go" onClick={()=>{this.inputGo()}}> 
                                <svg viewBox="0 0 218.36 200"><path fill="var(--c-light)" d="M187.14,109.09l-61.62,61.62a9.09,9.09,0,0,0,12.86,12.86l77.14-77.14a9.1,9.1,0,0,0,0-12.86L138.38,16.43a9.09,9.09,0,1,0-12.86,12.86l61.62,61.62H22.86a9.09,9.09,0,1,0,0,18.18Z"/></svg>
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

export default withRouter(Home);
export {ItemCard}