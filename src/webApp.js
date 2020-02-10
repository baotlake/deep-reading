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

import App from './App';
// import {AppWithRouter as App} from './App';
import Home from './home';
import './common.css';


class WebApp extends React.Component{
    constructor(){
        super();
        this.state={
            status:'input',
            input:"",
            xmlDoc:undefined,
        };
        this.inputIsURL = false;
        this.urlPattern = /^https?:\/\/(.+\.\w+.*)|(localhost.*)/;
    }

    setStatus(status){
        if(status != this.state.status){
            this.setState({
                status:status
            })
        }
    }

    loadXmlDoc(){
        let input = this.state.input;
        if (input == '') return;

        console.log('loadXmlDoc', input);

        let that = this;
        const parser = new DOMParser();
        if(this.inputIsURL){
            console.log('url')
            let encode = encodeURIComponent(input);
            // let url = `https://1773134661611650.cn-hongkong.fc.aliyuncs.com/2016-08-15/proxy/Tr/tr/?url=${encode}`;
            let url = `http://47.94.145.177:8000/get?url=${encode}`;
            if(/https?:\/\/192\.168\.\d+\.\d+.*/.test(input)) url = input;
            let request = new XMLHttpRequest(false,true);
            request.open("GET", url, true);

            // 异步
            request.onload = function(e){
                console.log('callback', request.responseText, e)
                if (request.status === 200) {
                    console.log('responseText', request.responseText);
                    let xmlDoc = parser.parseFromString(request.responseText, "text/html");
                    // 插入base标签, 解决图片等相对路径产生的问题
                    let base = xmlDoc.createElement('base');
                    base.href = input; 
                    xmlDoc.head.insertBefore(base, xmlDoc.head.firstChild);

                    that.setState({
                        xmlDoc:xmlDoc,
                        status:'parse'
                    })
                }else{
                    console.error('webApp.js function: judgeInput XMLHttpRequest Error');
                }
            };

            request.onerror = function(){
                // 提示
                console.warn('webApp.js: judgeInput() function: request.send Error: please check Network!');
            };

            request.send(null);
        }else{
            // 非URL, 文本 或 富文本
            let xmlDoc = parser.parseFromString(input, "text/html");
            this.setState({
                xmlDoc:xmlDoc,
                status:'parse'
            })
        }
    }

    setInput(input, type){
        console.log('setInput', input, type);
        if(input == this.state.input) return;
        this.setState({
            input:input,
            status:'load'
        })
        this.inputIsURL = type;
    }

    checkURI(){
        let urlParams = (new URL(window.location.href)).searchParams;
        let url = urlParams.get('url');
        console.log('URI',url)
        if(this.urlPattern.test(url)){
            this.inputIsURL = true;
            if(this.state.input == url) return;
            this.setState({
                input:url,
                status:'load'
            });
        }
    }

    render(){
        console.log('webApp render.')
        if(this.state.status == 'input') this.checkURI();
        if(this.state.status == 'load') this.loadXmlDoc();
        let Page = (
                    <div>
                        <Router>
                            <div>
                                <span>🕐{this.state.status}</span>
                                <Switch>
                                    <Route exact path="/home">
                                        <Home
                                            setInput={(input, type)=>this.setInput(input, type)}
                                        ></Home>
                                    </Route>
                                    <Route path="/r">
                                        <App 
                                            doc={this.state.xmlDoc} 
                                            url={this.inputIsURL ? this.state.input : ''}
                                            setInput={(input, type)=>this.setInput(input, type)}
                                        ></App>
                                    </Route>
                                    <Route path="/users" >
                                        <h1>E3</h1>
                                    </Route>
                                    
                                </Switch>
                            </div>
                            <div className="wrp-nav">
                                <div className="wrp-nav-item-container">
                                    <Link to="/home">
                                        <div className="wrp-nav-item">
                                            <svg className="wrp-nav-item-icon" viewBox="0 0 1024 1024" version="1.1" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M854.08768 503.1168l0 342.08768c0 44.450816-36.040704 80.490496-80.49152 80.490496L612.614144 925.694976 612.614144 664.09984c0-44.450816-36.03968-80.490496-80.490496-80.490496l-40.245248 0c-44.450816 0-80.49152 36.03968-80.49152 80.490496L411.38688 925.696 250.40384 925.696c-44.450816 0-80.490496-36.03968-80.490496-80.490496l0-342.08768L49.175552 503.117824 512 60.416l462.824448 442.701824L854.08768 503.117824z" p-id="13773"></path></svg>
                                            <div className="wrp-nav-item-title">首页</div>
                                        </div>
                                    </Link>
                                    <Link to="/find">
                                        <div className="wrp-nav-item">
                                            <svg className="wrp-nav-item-icon" viewBox="0 0 1024 1024" version="1.1" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M534.378667 574.549333c31.338667 0 58.410667-17.130667 73.152-42.346667 0.149333 0.149333 0.256 0.256 0.405333 0.405333 32.341333-55.658667 57.045333-127.168 74.176-190.869333-57.472 15.466667-121.024 36.949333-173.717333 64.725333-1.365333 0.725333-2.730667 1.450667-4.096 2.176-9.557333 5.141333-12.8 7.445333-13.952 8.405333-24.490667 14.933333-41.024 41.642667-41.024 72.448C449.322667 536.469333 487.402667 574.549333 534.378667 574.549333z" p-id="14571"></path><path d="M512.021333 64C264.554667 64 64 264.554667 64 511.978667 64 759.445333 264.554667 960 512.021333 960 759.381333 960 960 759.445333 960 511.978667 960 264.512 759.381333 64 512.021333 64zM603.989333 603.989333c-90.986667 90.944-304.149333 120.213333-304.149333 120.213333s29.269333-213.205333 120.213333-304.149333 304.149333-120.213333 304.149333-120.213333S694.976 513.045333 603.989333 603.989333z" p-id="14572"></path></svg>
                                            <div className="wrp-nav-item-title">发现</div>
                                        </div>
                                    </Link>
                                    <Link to="/word">
                                        <div className="wrp-nav-item">
                                            {/*<svg className="wrp-nav-item-icon" viewBox="0 0 1024 1024" version="1.1" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M384 490.666667h256a117.418667 117.418667 0 0 0 117.333333-117.333334v-256A117.418667 117.418667 0 0 0 640 0H384a117.418667 117.418667 0 0 0-117.333333 117.333333v256A117.418667 117.418667 0 0 0 384 490.666667z m32-309.333334a96 96 0 1 1 192 0v192a32 32 0 0 1-64 0V298.666667a21.333333 21.333333 0 0 0-21.333333-21.333334h-21.333334a21.333333 21.333333 0 0 0-21.333333 21.333334v74.666666a32 32 0 0 1-64 0v-192z m85.333333 32h21.333334a21.333333 21.333333 0 0 0 21.333333-21.333333v-10.666667a32 32 0 0 0-64 0v10.666667a21.333333 21.333333 0 0 0 21.333333 21.333333z m-128 320h-256A117.418667 117.418667 0 0 0 0 650.666667v256A117.418667 117.418667 0 0 0 117.333333 1024h256a117.418667 117.418667 0 0 0 117.333334-117.333333v-256a117.418667 117.418667 0 0 0-117.333334-117.333334z m-47.573333 257.024A95.914667 95.914667 0 0 1 245.333333 938.666667h-64a32 32 0 0 1-32-32v-256a32 32 0 0 1 32-32h64a95.872 95.872 0 0 1 80.426667 148.309333 21.333333 21.333333 0 0 0 0 23.381333zM245.333333 810.666667H234.666667a21.333333 21.333333 0 0 0-21.333334 21.333333v21.333333a21.333333 21.333333 0 0 0 21.333334 21.333334h10.666666a32 32 0 0 0 0-64z m0-128H234.666667a21.333333 21.333333 0 0 0-21.333334 21.333333v21.333333a21.333333 21.333333 0 0 0 21.333334 21.333334h10.666666a32 32 0 0 0 0-64z m661.333334-149.333334h-256a117.418667 117.418667 0 0 0-117.333334 117.333334v256A117.418667 117.418667 0 0 0 650.666667 1024h256A117.418667 117.418667 0 0 0 1024 906.666667v-256a117.418667 117.418667 0 0 0-117.333333-117.333334z m-85.333334 341.333334a32 32 0 0 1 0 64 160 160 0 0 1 0-320 32 32 0 0 1 0 64 96 96 0 1 0 0 192z" p-id="18802"></path></svg>*/}
                                            <svg className="wrp-nav-item-icon" version="1.1" viewBox="0 0 200 200" ><path d="M78.6,96.4h42.8c10.8,0,19.6-8.8,19.6-19.6V34.1c0-10.8-8.8-19.6-19.6-19.6H78.6C67.8,14.5,59,23.3,59,34.1v42.8	C59,87.7,67.8,96.4,78.6,96.4z M84,44.8c0-8.9,7.2-16,16-16s16,7.2,16,16v32.1c0,3-2.4,5.3-5.3,5.3s-5.3-2.4-5.3-5.3V64.4	c0-2-1.6-3.6-3.6-3.6h-3.6c-2,0-3.6,1.6-3.6,3.6v0v12.5c0,3-2.4,5.3-5.3,5.3S84,79.8,84,76.8V44.8z M98.2,50.1h3.6	c2,0,3.6-1.6,3.6-3.6v-1.8c0-3-2.4-5.3-5.3-5.3s-5.3,2.4-5.3,5.3v1.8C94.7,48.5,96.3,50.1,98.2,50.1L98.2,50.1z M76.8,103.6H34.1	c-10.8,0-19.6,8.8-19.6,19.6v42.8c0,10.8,8.8,19.6,19.6,19.6h42.8c10.8,0,19.6-8.8,19.6-19.6v-42.8	C96.4,112.3,87.7,103.6,76.8,103.6L76.8,103.6z M68.9,146.5c4.8,7.4,2.7,17.3-4.7,22.2c-2.6,1.7-5.7,2.6-8.8,2.6H44.8	c-3,0-5.3-2.4-5.3-5.3v-42.8c0-3,2.4-5.3,5.3-5.3h10.7c8.8,0,16,7.1,16,16c0,3.1-0.9,6.2-2.6,8.8C68.1,143.8,68.1,145.3,68.9,146.5	L68.9,146.5z M55.5,149.9h-1.8c-2,0-3.6,1.6-3.6,3.6v3.6c0,2,1.6,3.6,3.6,3.6h1.8c3,0,5.3-2.4,5.3-5.3	C60.8,152.3,58.4,149.9,55.5,149.9L55.5,149.9z M55.5,128.5h-1.8c-2,0-3.6,1.6-3.6,3.6v3.6c0,2,1.6,3.6,3.6,3.6h1.8	c3,0,5.3-2.4,5.3-5.3C60.8,130.9,58.4,128.5,55.5,128.5L55.5,128.5z M165.9,103.6h-42.8c-10.8,0-19.6,8.8-19.6,19.6v42.8	c0,10.8,8.8,19.6,19.6,19.6h42.8c10.8,0,19.6-8.8,19.6-19.6v-42.8C185.5,112.3,176.7,103.6,165.9,103.6L165.9,103.6z M151.7,160.6	c3,0,5.3,2.4,5.3,5.3s-2.4,5.3-5.3,5.3c-14.8,0-26.7-12-26.7-26.7c0-14.8,12-26.7,26.7-26.7c3,0,5.3,2.4,5.3,5.3	c0,3-2.4,5.3-5.3,5.3c-8.9,0-16,7.2-16,16S142.8,160.6,151.7,160.6z"/></svg>
                                            <div className="wrp-nav-item-title">单词</div>
                                        </div>
                                    </Link>
                                    <Link to="/about">
                                        <div className="wrp-nav-item">
                                            {/*<svg className="wrp-nav-item-icon" viewBox="0 0 1024 1024" version="1.1" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M511.999 0C229.222 0 0 229.222 0 511.999c0 282.779 229.222 511.999 511.999 511.999 282.779 0 511.999-229.219 511.999-511.999C1023.997 229.222 794.778 0 511.999 0zM496.151 832.358c-24.575 0-44.517-23.71-44.517-52.92l-0.18-322.402c0-29.235 19.942-52.915 44.52-52.915 24.6 0 44.515 23.705 44.515 52.915l0.18 322.402C540.669 808.648 520.729 832.358 496.151 832.358zM496.151 307.429c-26.417 0-47.845-25.445-47.845-56.857l-0.18-1.715c0-31.41 21.427-56.857 47.847-56.857 26.415 0 47.845 25.472 47.845 56.857l0.18 1.715C543.999 281.957 522.569 307.429 496.151 307.429z" p-id="19538"></path></svg>*/}
                                            <svg className="wrp-nav-item-icon" version="1.1" x="0px" y="0px" viewBox="0 0 200 200"><path d="M100,10c-49.7,0-90,40.3-90,90c0,49.7,40.3,90,90,90c49.7,0,90-40.3,90-90C190,50.3,149.7,10,100,10z M97.2,156.3	c-4.3,0-7.8-4.2-7.8-9.3l0-56.7c0-5.1,3.5-9.3,7.8-9.3c4.3,0,7.8,4.2,7.8,9.3l0,56.7C105,152.1,101.5,156.3,97.2,156.3z M97.2,64	c-4.6,0-8.4-4.5-8.4-10l0-0.3c0-5.5,3.8-10,8.4-10c4.6,0,8.4,4.5,8.4,10l0,0.3C105.6,59.6,101.9,64,97.2,64z"/></svg>
                                            <div className="wrp-nav-item-title">关于</div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </Router>                       
                    </div>
                );

        return Page;
    }
}

export default WebApp;
