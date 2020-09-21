import React from 'react';
import { connect } from 'react-redux';

import * as actions from './actions/app';
import * as explActions from './actions/explanation';
import * as aActions from './actions/a';

import ReactDOM from 'react-dom';

import jQuery from 'jquery';
import {
    Link,
    withRouter,
} from 'react-router-dom'

import './App.css';

import Word from './components/word';
import ReadPanel from './components/readPanel';
import ManageExplanation from './containers/ManageExplanation';

import TranslatePanel from './containers/TranslatePanel';
import Head from './Head';
import A from './components/a';

import {extractPart} from './utils/core'

// var wrp = "wordReadingPro";

// import ReactDOMServer from 'react-dom/server';

// import getText from './text.js';
// import { isFulfilled } from 'q';
// import { throwError } from 'rxjs';

class App extends React.Component{
    constructor(props){
        super(props);
        /**props.url */
        this.state={
            // showExplainPanel:false,
            showLinkDialog:false,
            // clickedWord:{},
            // translateText:undefined,
            translateCount:0,
        };
        this.htmlElements = [];
        // this.headCssText = '';
        // this.externalLink = '';
        // this.abstract = null;
        this.extractScope = {
            front:1,
            behind:1,
            // fn, bn为断句过程中的变量
            fn:0,
            bn:0,
        };
        this.translateText = {};
        // 标识阅读界面, 页面序号
        this.docId = -1;
        // 链接，点击链接时显示转跳对话框
        this.link = {
            hash:false,
            url:"",
        };
        this.config = {
            splitWord:false,
            splitSentence:true,
            runScript:true,
        };

        // 移除$的控制权，避免冲突
        jQuery.noConflict();
        this.checkURI()
    }

    // 放入actions
    handleClickWord(e){
        this.props.tapWord(e)
    }

    // translate(e){
    //     // console.log('translate',e, e.target, e.currentTarget,'\ndetail',e.detail,'\ntouches',e.touches,'\ntargetTouches',e.targetTouches,'\nchangedTouches',e.changedTouches,'\neventPhase',e.eventPhase)
    //     // console.log(window.getSelection());
    //     // this.extractScope.fn = 0;
    //     // this.extractScope.bn = 0;
    //     let target = e.target;
    //     let part = this.extractPart(target, null,'sentence');
    //     let sentence = part[0].texts.join('') + part[1].texts.join('');
    //     sentence = sentence.trim();
    //     console.log('sentence ->:', sentence);
    //     if(sentence.length < 3) return;
    //     this.translateText = {
    //         text:sentence,
    //         elements:[...part[0].elements,...part[1].elements]
    //     }
    //     this.setState({
    //         translateCount:this.state.translateCount + 1,
    //     })

    // }


    styleFormat(cssText){
        cssText.replace(/-([a-z])/,(m,g)=>g.toUpperCase());
        if(cssText != ""){
            cssText = cssText.replace(/:\s*/g, '":"')
            cssText = cssText.replace(/;\s*/g, '","')
            cssText = '{"' + cssText + '"}'
            cssText = cssText.replace(/,""/g, '')
            // 还需要对一些内容进行替换，比如 border-radius 替换为borderRadius
            let style = {};
            try{
                style = JSON.parse(cssText)
            }catch(e){

            }

            return style
        }
        return {}
    }

    
    // 未使用 
    findCrossIndex(node){
        /** node为父标签，判断子标签的交叉情况
         *  index 表示该标签的*前*半部分 上个标签的后部分 有交叉情况
         *  返回值为列表
         */
        let t1 = Date.now()
        let indexList = [];
        let childNodes = node.childNodes;
        if( childNodes.length <= 1 || !node) return indexList;
        for(let i = 1; i < childNodes.length; i++){
            this.isInline(childNodes[i].nodeName)
            this.isInline(childNodes[i - 1].nodeName)
            if(this.isInline(childNodes[i].nodeName) && this.isInline(childNodes[i - 1].nodeName)){
                let nodeChar = childNodes[i].textContent[0];
                let lastNodeChar = childNodes[i - 1].textContent[childNodes[i - 1].textContent.length - 1];
                let re = /[a-zA-Z0-9_-]/;
                if(re.test(nodeChar) && re.test(lastNodeChar)){
                    indexList.push(i);
                }
            }
        }
        let t2 = Date.now()
        console.log('FindCrossIndex runing time', t2 - t1)
        return indexList;
    }

    // 未使用
    getHeadCssText(head){
        if(!head) return '';
        let cssText = '';
        let styles = head.getElementsByTagName("style");
        for(let i=0; i < styles.length; i++){
            cssText = cssText + styles[i].innerText;
        }
        return cssText;
    }

    hiddenSomeone(name){
        let names = name.split(' ');
        names.map((name)=>{
            switch(name){
                case "explainPanel":
                    this.props.setExplShow(false);
                    break;
                case "linkDialog":
                    this.props.setAShow(false)
                    break;
            }
        })
    }

    clickLink(link, status){
        console.log("click Link", link)
        if(!link) return;

        this.link.url = link;
        this.link.hash = false;

        let url = new URL(link);
        let docUrl = new URL(this.props.url)
        if((url.origin + url.pathname)==(docUrl.origin + docUrl.pathname)){
            if(url.hash != ""){
                // # hash 页面内标识符
                this.link.hash = true;
                this.link.url = url.hash;
            }
        }

        // this.externalLink = link;

        if(this.state.showLinkDialog == status) return;
        if(typeof(status) != 'boolean') return;
        this.setState({
            showLinkDialog:status
        });
    }

    readNewPage(){
        // console.log("App.js readNewPage()", this.link.url);

        // // this.props.history.push(`/r?url=${encodeURIComponent(this.link.url)}`);
        // this.props.setInput(this.link.url, true);

        // // 关闭对话框
        // if(this.state.showExplainPanel){
        //     this.setState({
        //         showExplainPanel:false
        //     });
        //     console.log('readNewPage')
        //     this.props.setExplShow(false)
        // };

        // if(this.state.showLinkDialog){
        //     this.setState({
        //         showLinkDialog:false
        //     });
        // };
    }
    
    render() {
        let htmlElements = this.props.app.elements;
        console.log('App.js: render()  status = ', this.props.app.status)

        console.log(`props.app`, this.props.app)

        return(
            <>
                <Head></Head>
                <div id="wrp-app" >
                    <ReadPanel
                        padding={!this.props.url}
                        content={htmlElements}
                        hiddenSomeone = {(name)=>this.hiddenSomeone(name)}
                        handleClick={(e)=>{this.handleClickWord(e)}}
                        translate={(e)=>this.translate(e)}
                    />

                    <ManageExplanation/>
                    <div className="wrp-view">
                        <TranslatePanel 
                            // translateTarget={this.state.translateTarget}
                            // translateText = {this.translateText}
                            // translateCount ={this.state.translateCount}
                            // clickWord={(e)=>this.handleClickWord(e)}
                        />
                        <div className={'wrp-link-dialog-box '.concat(this.props.a.show ? 'link-dialog-show' : '')} >
                            <div>
                                {(this.link.hash)?
                                <a href={this.link.url}>
                                    <div className="wrp-nav-item wrp-ld-button">
                                        <svg className="wrp-nav-item-icon " viewBox="0 0 1024 1024" version="1.1" fill="var(--c-dark)" xmlns="http://www.w3.org/2000/svg" p-id="4385"><defs><style type="text/css"></style></defs><path d="M250.016 416.992l319.008 43.008 40 310.016 236-591.008zM120.992 464q-11.008-0.992-18.496-8.512t-8.992-19.008 4-20.512 15.488-12.992l778.016-311.008q8.992-4 18.016-2.016t16 8.992 8.992 16-2.016 18.016l-310.016 776q-4 10.016-13.504 15.488t-20.512 4-18.496-8.992-8.512-18.496l-48.992-384z" p-id="4386"></path></svg>
                                        <div className="wrp-nav-item-title" >转跳至此处</div>
                                    </div>
                                </a>
                                :
                                <Link 
                                    className="wrp-nav-item wrp-ld-button" 
                                    to={`/wrp-read?url=${encodeURIComponent(this.props.a.url)}`} 
                                    // onClick={()=>this.readNewPage()}
                                >
                                    <svg className="wrp-nav-item-icon " viewBox="0 0 1024 1024" version="1.1"  fill="var(--c-dark)"><path  d="M863 942H500.3L309.7 822.6c-33.8-21.2-54.9-60.7-54.9-103V162.5c0-30.4 14.5-57.6 38.7-72.9 24.4-15.4 53.6-15.4 78-0.1L507 174.3h356c52.9 0 96 46.9 96 104.6v558.4c0 57.8-43.1 104.7-96 104.7z m-345.6-69.8H863c17.6 0 32-15.6 32-34.9V278.9c0-19.2-14.4-34.9-32-34.9H489.9l-150.3-94.1c-6.4-4-12-1.3-14.1 0-2.5 1.6-6.7 5.3-6.7 12.6v557.1c0 17.5 8.7 33.8 22.8 42.5l175.8 110.1z" fill="#595959" p-id="4277"></path><path d="M508.8 942H161c-52.9 0-96-46.9-96-104.6V278.9c0-57.7 43.1-104.6 96-104.6h125.8v69.8H161c-17.6 0-32 15.6-32 34.9v558.4c0 19.2 14.4 34.9 32 34.9h347.8V942zM497.5 174.3h1v69.8h-1z" p-id="4278"></path><path d="M480 209.2h64v697.2h-64z" p-id="4279"></path></svg>
                                    <div className="wrp-nav-item-title">阅读新页面</div>
                                </Link>
                                }
                            </div>
                            <a href={this.externalLink} target="_blank" href={this.props.a.url}>
                                <div className="wrp-nav-item wrp-ld-button">
                                    <svg className="wrp-nav-item-icon " version="1.1" x="0px" y="0px" viewBox="0 0 200 200" ><path fill="var(--c-dark)" d="M168.8,123.3c0-3.2,2.8-5.8,6.3-5.8s6.3,2.6,6.3,5.8V164c0,6.4-5.6,11.6-12.5,11.6H31.2	c-6.9,0-12.5-5.2-12.5-11.6V36c0-6.4,5.6-11.6,12.5-11.6H75c3.5,0,6.3,2.6,6.3,5.8s-2.8,5.8-6.3,5.8H37.5c-3.4,0-6.2,2.6-6.3,5.8	c0,0,0,0,0,0.1v116.2c0,3.2,2.8,5.8,6.2,5.8c0,0,0,0,0.1,0h125c3.4,0,6.2-2.6,6.3-5.8c0,0,0,0,0-0.1V123.3z M74,132.8	c-2.4,2.3-6.4,2.3-8.8,0c0,0,0,0,0,0c-2.4-2.2-2.5-5.9-0.1-8.2c0,0,0,0,0,0l94-87.4l-34.4,0.1c-3.4,0-6.1-2.5-6.2-5.7	c0,0,0-0.1,0-0.1c0-3.2,2.8-5.8,6.2-5.8l49.8-0.2c3.4,0,6.1,2.5,6.2,5.7c0,0,0,0.1,0,0.1l-0.2,46.4c-0.1,3.2-2.8,5.8-6.3,5.8	c-3.4,0-6.2-2.5-6.2-5.6c0,0,0-0.1,0-0.1l0.1-32.6L74,132.8z"/></svg>
                                    <div className="wrp-nav-item-title">新窗口打开</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    checkURI(){
        console.log('webApp.js: checkURI()');

        let urlParams = (new URL(window.location.href)).searchParams;
        let url = urlParams.get('url');
        let key = urlParams.get('key');

        if(key){
            let doc = localStorage.getItem(key);
            // this.props.setXmlDoc(doc)
            this.props.docParser(doc, '')
        }

        let elements = this.props.elements || []

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
            if(this.input == url) return;
            this.props.setUrl(url)
            this.props.setStatus('loading')
            this.props.loadXmlDoc(url)
        }
        this.props.setAShow(false)
        this.props.setExplShow(false)

    }

    // 生命周期函数
    componentDidMount(){
        console.log('componentDidMount')
        let self = this;
        // 窗口滚动事件可以移动至readpenal中
        // 窗口滚动事件
        let windowScroll = function(e){
            if(!self.state.showExplainPanel) return;

            console.log('window scroll')
            self.props.setExplShow(false)

            if(!self.state.showLinkDialog) return;
            self.props.setAShow(false)
        }
        // window.addEventListener('scroll', windowScroll);
        // 路由监听
        this.props.history.listen(location => {
            console.log('history.listen',location, window.location)
            let url = new URLSearchParams(window.location.search).get('url')
            if (this.props.app.status !== 'loading') {
                this.checkURI()
            }
        })
    }

    async componentDidUpdate(){

        console.log('App.js componentDidUpdate')
        console.log('this.docId', this.docId, "this.props.docId",this.props.docId);

        // TODO
        // 代码优化
        if(this.docId != this.props.docId && this.props.status === "completed" && false){

            this.docId = this.props.docId;
            
            // 加载Script
            if(this.config.runScript){
                let wrpReadPanel = jQuery("#wrp-read-panel")[0];
                let scriptList = wrpReadPanel.getElementsByTagName('script');

                let fakeHead = jQuery("#wrp-head")[0];
                let headScriptList= fakeHead.getElementsByTagName('script');
                scriptList = [...scriptList, ...headScriptList];
                
                let wrpApp = jQuery("#wrp-app")[0];
                for(let s of scriptList){
                    let script = document.createElement('script');
                    if(s.hasAttribute('type')) script.type = s.type;
                    if(s.hasAttribute('data-href')) script.src = s.getAttribute('data-href');
                    if(s.hasAttribute('async')) script.async = s.async;
                    if(s.hasAttribute("data-src")) script.setAttribute("data-src", s.getAttribute("data-src"));
                    if(s.innerText) script.innerText = s.innerText;
                    // if(s.hasAttribute('integrity')) script.integrity = s.integrity;
                    wrpApp.appendChild(script);
                    // await new Promise((resolve,reject)=>{setTimeout(()=>{resolve()}, 500)});
                }

                // 手动触发 DOMContentLoaded
                var DOMContentLoaded_event = document.createEvent("Event");
                DOMContentLoaded_event.initEvent("DOMContentLoaded", true, true);
                window.document.dispatchEvent(DOMContentLoaded_event)

                // 监控DOM更新


            }
            



        }

        console.log("PATH", this.props.input);

    }

    componentWillUnmount(){
        console.log("App.js() componentWillUnmout() ");
    }
}

const mapStateToProps = (state) => ({
    app: state.app,
    a: state.a
})

const mapDispatchToProps = (dispatch) => ({
    setStatus: (status) => {
        dispatch(actions.setStatus(status))
    },
    setHistory: (historyList, item) => {
        dispatch(actions.setHistory(historyList, item))
    },
    setXmlDoc: xmlDoc => {
        dispatch(actions.setXmlDoc(xmlDoc))
    },
    docParser: (doc, baseUrl) => {
        console.log('doc Parser----------------- dispatch')
        dispatch(actions.docParser(doc, baseUrl))
    },

    tapWord: events => {
        dispatch(explActions.tapWord(events))
    },
    loadWordData: word => {
        dispatch(explActions.loadWordData(word))
    },
    setExplShow: show => {
        dispatch(explActions.setShow(show))
        dispatch(explActions.setSetting({show:false}))
        dispatch(explActions.setMore([]))
        dispatch(explActions.setMoreFold(false))
    },
    setAShow: isShow => {
        dispatch(aActions.setShow(isShow))
    },
    setASrc: src => {
        dispatch(aActions.setSrc(src))
    },
    loadXmlDoc: url => {
        console.log(`mapDispatchToProps: input: ${url}`)
        dispatch(actions.loadXmlDoc(url))
    },
    setUrl: url => {
        dispatch(actions.setUrl(url))
    },
    
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));

// let AppWithRouter = withRouter(WrpApp);
// export { AppWithRouter }; 