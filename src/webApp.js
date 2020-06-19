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
import './webApp.css';

import WrpApp from './App';
// import {AppWithRouter as App} from './App';
import Home from './home';
import Status from './status';
import './common.css';

import {NavBar} from './components/navBar';
import FindPage from './components/findPage';


class WebApp extends React.Component{
    constructor(){
        super();
        this.state={
            status:'inputting',
        };
        this.xmlDoc = undefined;
        this.input = "";
        this.inputIsURL = false;
        this.urlPattern = /^https?:\/\/(.+\.\w+.*)|(localhost.*)/;
        this.readHistory = [];
        this.docId = 0;
        /** history = {icon,title,des,input,isURL} */

        let histStr = localStorage.getItem('read_history');
        let history = JSON.parse(histStr);
        if(Array.isArray(history)){
            this.readHistory = history;
        }

    }

    setStatus(status){

        if(status != this.state.status){
            console.log('set status', status, this.state.status)
            this.setState({
                status:status
            })
        }
    }

    loadXmlDoc(server=1){
        let input = this.input;
        if (input == '') return;

        console.log('webApp loadXmlDoc', input);

        const parser = new DOMParser();
        if(this.inputIsURL){
            // console.log('url')
            let encode = encodeURIComponent(input);
            // let url2 = `https://1773134661611650.cn-hongkong.fc.aliyuncs.com/2016-08-15/proxy/Tr/tr/?url=${encode}`;
            let url2 = `https://1773134661611650.ap-northeast-1.fc.aliyuncs.com/2016-08-15/proxy/Tr/tr/?url=${encode}`;
            let url = `http://47.94.145.177:8000/get?url=${encode}`;
            if(server==2) url = url2;

            let host = new URL(input).host;
            let timeout = 10000;
            switch(host){
                case "www.wikipedia.org":
                case "wikibooks.org":
                case "m.wikipedia.org":
                case "en.wikipedia.org":
                case "en.m.wikipedia.org":
                case "twitter.com":
                case "t.co":
                case "news.google.com":
                case "www.bbc.com":
                case "bbc.com":
                case "blog.diigo.com":
                case "diigo.com":
                case "www.kali.org":
                    url = url2;
                    timeout = 50000;
                    break;
                case "localhost:3000":
                case "localhost:8888":
                    url = input;
                    break;

            }
            
            // 局域网网址, 开发用
            if(/https?:\/\/192\.168\.\d+\.\d+.*/.test(input)) url = input;

            let urlObj = new URL(input);
            switch (urlObj.host){
                case "localhost:8888":
                    url = input;
                    break;
            }

            let xhr = new XMLHttpRequest();

            xhr.open("GET", url, true);
            xhr.timeout = timeout;

            let self = this;
            const onload = function(e){
                // console.log('callback', xhr.responseText, e)
                if (xhr.status === 200) {
                    // console.log('responseText', xhr.getResponseHeader("Content-Type"));
                    let contentType = xhr.getResponseHeader('Content-Type');
                    if(contentType && !/[(text\/html)(charset\=utf\-8)]/.test(contentType)){
                        self.setState({
                            status:"typeError"
                        })
                        return;
                    }
                    self.xmlDoc = parser.parseFromString(xhr.responseText, "text/html");
                    // 插入base标签, 解决图片等相对路径产生的问题
                    let base = self.xmlDoc.createElement('base');
                    base.href = input; 
                    self.xmlDoc.head.insertBefore(base, self.xmlDoc.head.firstChild);
                    // this.xmlDoc = xmlDoc;
                    self.docId = self.docId + 1;
                    self.setStatus('parsing');
                    console.log('status', self.state.status)
                }else{
                    console.error('webApp.js function: judgeInput XMLHttpRequest Error');
                    self.setStatus('failed');


                }
            };
            // 异步
            xhr.onload = onload;

            xhr.onabort = (e)=>{
                // console.log('abort')
                self.setStatus('failed');

            }

            // xhr.onreadystatechange = function(e){
            //     console.log('status change',e);
            // }

            xhr.onerror = function(e){
                // 提示
                console.warn('webApp.js: judgeInput() function: request.send Error: please check Network!',e);

                self.setState({
                    status:'failed'
                })
                
            };

            xhr.ontimeout = function(){
                // console.log('timeout!')
                xhr.abort();
                self.setState({
                    status:'timeout'
                })
            }

            xhr.send(null);
        }else{
            // 非URL, 文本 或 富文本
            this.xmlDoc = parser.parseFromString(input, "text/html");
            this.docId = this.docId + 1;
            this.setState({
                status:'parsing'
            })

        }
    }

    setInput(input, type){
        console.log("webApp.js: setInput, ", input, type);
        if(input == this.input){
            //当前阅读的页面，跳过加载，直接渲染
            return ;
        };

        this.input = input;
        this.inputIsURL = type;

        this.setStatus('loading');
    }

    checkURI(){
        let urlParams = (new URL(window.location.href)).searchParams;
        let url = urlParams.get('url');
        console.log('URI',url)
        if(this.urlPattern.test(url)){
            this.inputIsURL = true;
            if(this.input == url) return;
            this.setStatus('loading');
            this.input = url;

            // console.log('checkURI', this.state.status)
        }
    }

    // 待移除
    // handleClickStatus(){
    //     if(this.state.status == 'completed') return;
    //     if(this.state.status == 'loading') return;
    //     if(this.state.status == 'parsing') return;

    //     this.setState({
    //         status:'completed'
    //     })
    // }


    setReadHistory(value){
        console.log('setReadHistory 2', value);
        
        // 查重
        for(let i=this.readHistory.length - 1; i >=0; i--){
            if(this.readHistory[i].input === value.input){
                this.readHistory.splice(i,1);
            }
        }

        this.readHistory.push(value);

        while(this.readHistory.length > 10){
            this.readHistory.shift();
        }

        console.log('setReadHistory 3', this.readHistory);

        // 存储
        let histStr = JSON.stringify(this.readHistory);
        localStorage.setItem('read_history', histStr);
    }

    componentWillUnmount(){

    }

    componentWillMount(){
        console.log('conmponentWillMount');
    }

    componentDidMount(){
        console.log('webApp.js: componentWillMount');
        this.componentDidUpdate();
        
    }

    componentDidUpdate(){
        console.log('webApp.js: componentDidUpdate', window.location);
        
        // 对页面内js控制的转跳进行重定向
        let location = window.location;
        let dir = location.pathname.split("/")[1]; // 没有的话返回""
        switch(dir){
            case "wrp-read":
            case "wrp-home":
            case "wrp-find":
            case "wrp-word":
            case "wrp-about":
            case "r":
                break;
            default:
                console.log("pathname 为 其他路径", dir);
                // js转跳 或是 用户输入的路径
                let newSearch = `?url=${encodeURIComponent(this.input + location.pathname + location.search)}`;
                let origin;
                if(this.readHistory[this.readHistory.length - 1]){
                    origin = new URL(this.readHistory[this.readHistory.length - 1].input).origin;
                    let href = `${location.origin}/wrp-read?url=${encodeURIComponent(origin + location.pathname + location.search)}`;
                    console.log('转跳目标 ->', origin + location.pathname + location.search)
                    window.location.href = href;

                }else{
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

    render(){
        console.log('webApp.js: render()');

        if(this.state.status == 'inputting') this.checkURI();
        if(this.state.status == 'loading') this.loadXmlDoc();
   
        let Page = (
                    <>
                        <Router>
                                <Switch>
                                    <Route path="/" >
                                        <Switch>
                                            <Route exact path="/wrp-home">
                                                <Home
                                                    setInput={(input, type)=>this.setInput(input, type)}
                                                    readHistory={this.readHistory}
                                                ></Home>
                                            </Route>
                                            <Route path="/wrp-find" >
                                                <FindPage></FindPage>
                                            </Route>
                                            <Route
                                                path="/test/:id"
                                            >
                                                <div>Test </div>
                                            </Route>
                                            <Route path="/:name">
                                                <WrpApp
                                                    doc={this.xmlDoc}
                                                    docId={this.docId}
                                                    url={this.inputIsURL ? this.input : ''}
                                                    setInput={(input, type)=>this.setInput(input, type)}
                                                    setStatus={(status)=>this.setStatus(status)}
                                                    setReadHistory={(value)=>this.setReadHistory(value)}
                                                    status={this.state.status}
                                                ></WrpApp>
                                                {
                                                    // this.showStatus()
                                                }
                                                <Status
                                                    status={this.state.status}
                                                    url={this.input}
                                                    setStatus={(status)=>this.setStatus(status)}
                                                />
                                            </Route>
                                        </Switch>
                                        <NavBar path={this.props.path}/>
                                    </Route>
                                </Switch>
                        </Router>                       
                    </>
                );

        return Page;
    }
}

export default WebApp;
