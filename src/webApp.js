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

    loadXmlDoc(){
        console.log('webApp.js: loadXmlDoc() ');
        let input = this.input;
        if (input == '') return;

        console.log('webApp loadXmlDoc', input);

        const parser = new DOMParser();
        if(this.inputIsURL){
            let encode = encodeURIComponent(input);
            // let url2 = `https://1773134661611650.cn-hongkong.fc.aliyuncs.com/2016-08-15/proxy/Tr/tr/?url=${encode}`;
            let url2 = `https://1773134661611650.ap-northeast-1.fc.aliyuncs.com/2016-08-15/proxy/Tr/tr/?url=${encode}`;
            let url = `http://47.94.145.177:8000/get?url=${encode}`;
            
            let inputObj = new URL(input);
            let timeout = 10000;
            switch(inputObj.host){
                case "www.wikipedia.org":
                case "wikibooks.org":
                case "m.wikipedia.org":
                case "en.wikipedia.org":
                case "en.m.wikipedia.org":
                case "twitter.com":
                case "t.co":
                case "news.google.com":
                case "developer.chrome.com":
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

            let xhr = new XMLHttpRequest();

            xhr.open("GET", url, true);
            xhr.timeout = timeout;

            let self = this;

            xhr.ontimeout = function(){
                // console.log('timeout!')
                xhr.abort();
                self.setState({
                    status:'timeout'
                })
            }

            // 只能由user agent设置
            // xhr.setRequestHeader("Origin",inputObj.origin);
            // xhr.setRequestHeader("Referer", inputObj.href);

            xhr.send(null);

            const onload = function(e){
                if (xhr.status === 200) {
                    // console.log('responseText', xhr.getResponseHeader("Content-Type"));
                    let contentType = xhr.getResponseHeader('Content-Type');
                    
                    // 返回类型是否为html 或 text 类型
                    if(contentType && !/[(text\/html)(charset\=utf\-8)]/.test(contentType)){
                        self.setState({
                            status:"typeError"
                        });
                        return;
                    }

                    self.xmlDoc = parser.parseFromString(xhr.responseText, "text/html");

                    // 解决相对路径问题
                    if(self.xmlDoc.getElementsByTagName('base').length === 0){
                        let base = self.xmlDoc.createElement('base');
                        base.href = input; 
                        self.xmlDoc.head.insertBefore(base, self.xmlDoc.head.firstChild);
                    }

                    self.docId = self.docId + 1;
                    self.setStatus('parsing');
                }else{
                    console.error('webApp.js: loadXmlDoc() 加载此网址：',input,"时发生错误, 请求状态码为",xhr.status);
                    self.setStatus('failed');
                }
            };

            // 异步加载
            xhr.onload = onload;

            // 终止
            xhr.onabort = (e)=>{
                // console.log('abort')
                self.setStatus('failed');

            }

            // xhr.onreadystatechange = function(e){
            //     console.log('status change',e);
            // }

            xhr.onerror = function(e){
                // 提示
                console.warn('webApp.js: loadXmlDoc() : request.send Error: please check Network!',e);

                self.setState({
                    status:'failed'
                })
                
            };

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
        console.log("webApp.js: setInput() ", input, type);
        if(input == this.input){
            console.log('input = this.input 跳过加载')
            this.setStatus('parsing');
            //当前阅读的页面，跳过加载，直接渲染
            return ;
        };

        this.input = input;
        this.inputIsURL = type;

        this.setStatus('loading');
    }

    checkURI(){
        console.log('webApp.js: checkURI()');

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
            case "wrp-test":
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
                                                path="/wrp-test/:id"
                                            >
                                                <div>
                                                    <input type="text" className="form-control input-sm header-search-input  js-site-search-focus " data-hotkey="s,/" name="q" placeholder="Search GitHub" data-unscoped-placeholder="Search GitHub" data-scoped-placeholder="Search" autocapitalize="off" aria-label="Search GitHub"></input>

                                                    <input style={{"border":"1px solid #000"}} onInput={()=>{console.log('test entering')}}></input>

                                                    <input style={{"border":"1px solid #000"}} ></input>
                                                </div>
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
