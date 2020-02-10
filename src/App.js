import React from 'react';
import ReactDOM from 'react-dom';
import {
    Link, 
    withRouter,
} from 'react-router-dom'

import './App.css';

import Word from './components/word';
import ReadPanel from './components/readPanel';
import ExplainPanel from './components/explainPanel';
import TranslatePanel from './components/translatePanel';
import head from './head';
import A from './components/a';

// import ReactDOMServer from 'react-dom/server';


// import getText from './text.js';
// import { isFulfilled } from 'q';
// import { throwError } from 'rxjs';

// myConsole.log()
const myConsole = {
    printLog:false,
    // printLog:true,
    log:function(...args){
        if(!this.printLog) return
        console.log(...args)
    }
}

var intervId;


class App extends React.Component{
    constructor(props){
        super(props);
        this.state={
            showExplainPanel:false,
            showLinkDialog:false,
            linkDialogTimeCount:3,
            clickedWord:{},
            translateTarget:undefined,
        };
        this.doc = undefined;
        this.htmlElements = [];
        this.headCssText = '';
        this.storeOriginalHead = false;
        this.externalLink = '';
    }

    // translatePanel.js 需要
    isInline(nodeName){
        const innerText = ['#text','b','i','em','s','small','u','strong','mark','span'];  // 移除'a'
        if(!typeof(nodeName) == "string"){
            throw "parameter type error, isInline() need string parameter!"
            // return false
        };
        // console.log('toLowerCase', nodeName);
        if(innerText.includes(nodeName.toLowerCase())){
            return true;
        }else{
            return false;
        };
    }

    frontHaveWordEnd(node){
        /**判断前半部分(node)的末尾是否是单词的末尾， 即判断前半部分(node)的末尾是否有单词分割符（空格等） */
        let children = node;
        let deep = 0;
        while(children){
            let child = children; // 备份
            if(!this.isInline(children.nodeName)) return false;
            if(children.nodeName == "#text"){
                let text = children.textContent;
                if(/[a-zA-Z0-9_-]/.test(text[text.length -1])) return true;
                return false;
            }

            
            if(!children.lastChild){
                children = children.previousSibling;
                // deep = deep 
            }else{
                children = children.lastChild;
                deep = deep + 1;
            }

            // 继续向上就不必了吧, 算了， 先写上
            if(!children && deep > 0){
                children = child.parentNode.previousSibling;
                deep = deep - 1;
            }
        }
    }

    behindHaveWordEnd(node){
        /**判断后半部分（node）的开端是否是单词的开端， 即判断后半部分(node)的开端是否有单词分割符（空格等） */
        let children = node;
        let deep = 0;
        while(children){
            let child = children;
            if(!this.isInline(children.nodeName)) return false;
            if(children.nodeName == "#text"){
                let text = children.textContent;
                if(/[a-zA-Z0-9_-]/.test(text[0])) return true;
                return false;
            }

            
            if(!children.firstChild){
                children = children.nextSibling;
                // deep = deep 
            }else{
                children = children.firstChild;
                deep = deep + 1;
            }

            // 继续向上就不必了吧, 算了， 先写上
            if(!children && deep > 0){
                children = child.parentNode.nextSibling;
                deep = deep - 1;
            }
        }
    }

    haveCrossWord(node){
        // 判断相邻两个节点之间是否含有交叉情况
        let nextNode = node.nextSibling;
        if(!node || !nextNode) return false;
        if(!this.isInline(node.nodeName) || !this.isInline(nextNode.nodeName)) return false;
        if(this.frontHaveWordEnd(node) && this.behindHaveWordEnd(nextNode)) return true;
        return false;
    }

    handleClickWord(word,position){
        this.setState({
            clickedWord:{word:word,position:position},
            showExplainPanel:true
        })
    }

    test2(e){
        let target = e.target;
        this.setState({
            translateTarget:target
        })
        
    }

    getWord(content){
        return (
            <Word
                content = {content}
                handleClick={(w,e)=>this.handleClickWord(w,e)}
                translate={(e)=>this.test2(e)}
            />
            );
    }

    textSplit(text){
        /**just #text ; 仅文本,不含其他标签 */
        if(!text) return [];
        let re = /\b/;
        let wordpattern = /\w+/;
        let List = [];
        // myConsole.log('---->', typeof(text))
        let splitList = text.split(re);
        for(let w of splitList){
            if(wordpattern.test(w)){
                List.push(this.getWord(w));
            }else{
                List.push(w);
            }
        }

        return List;
    }

    styleFormat(cssText){
        myConsole.log("cssText",cssText)
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
            myConsole.log("cssText",cssText,typeof(cssText))
            myConsole.log('style ->', style)

            return style
        }
        return {}
    }

    attToProps(content){
        if(!content) return {};
        let props = {};
        // let cssText = content.style.cssText;
        if(content.style) props['style'] = this.styleFormat(content.style.cssText);
        // let classList = content.classList;
        // console.log('classLIst', classList)
        if(content.id) props['id'] = content.id;
        if(content.classList.value) props.className = content.classList.value;
        if(content.hidden != null) props['hidden'] = content.hidden;
        if(content.src) props['src'] = content.src;
        if(content.width) props['width'] = content.width;
        if(content.height) props['height'] = content.height;
        if(content.nodeName == "IMG") props.style.maxWidth = '100%';

        if(content.href) props['href'] = content.href;
        if(content.href) props['rel'] = content.rel;
        if(content.target) props['target'] = content.target;

        if(content.type) props['type'] = content.type;


        return props;
    }

    extractFront(node,alterNode){
        // 提取单词前半部分, 在标签尾部，
        let getCross = false;
                
        if(node.nodeName == "#text"){
            // 文本 | 直接分割 返回

            let text = node.textContent;
            let cross, other;

            let splitList = text.split(/(\w*$)/); 
            // splitList = [Hello ','World']
            other = splitList[0] ? splitList[0] : '';
            cross = splitList[1] ? splitList[1] : '';
            if(/[\W]/.test(other[other.length - 1])) getCross = true;

            if(alterNode){ //alterNode == 
                // 将交叉部分移出xmlDoc
                // let newNode = doc.createTextNode(other)
                // node.parentNode.replaceChild(newNode, node)
            }
            
            let otherWord = this.textSplit(other);
            // console.log('return, cross, otherWord', ReactDOMServer.renderToString(cross),ReactDOMServer.renderToString(otherWord))
            return [cross,otherWord]
                        
        }else{
            // 标签 | 遍历 分割 返回
            let c  = node.lastChild;
            let crossChildren = [];
            let otherChildren = [];

            while(c){
                if(getCross){
                    // 已提取交叉情况，并移出xmlDoc
                    console.log('app-196-traversal');
                    otherChildren.push(this.htmlTraversal(c))
                }else{
                    // 继续迭代
                    let [cross, other] = this.extractFront(c,alterNode)
                    crossChildren.push(cross);
                    otherChildren.push(other)
                }
                c = c.previousSibling;  // previousSibling
            }
            let type = node.nodeName.toLowerCase(); //.replace('body','div')
            let props = this.attToProps(node);
            let crossElement = this.createElement(type,props,crossChildren);

            let otherElement = this.createElement(type,props,otherChildren);
            // console.log('return, crossElement, otherElement', ReactDOMServer.renderToString(crossElement),ReactDOMServer.renderToString(otherElement))
            return [crossElement, otherElement]
        }
    }

    // translatePanel.js 需要，考虑共享
    createElement(type,props,children){
        type = type.toLowerCase();
        let element;
        // const ignoreTag = ['#comment','#document','script']
        // const noChildren = ['img','hr','br','input','link','wbr']        

        switch(type){
            case "div":
            case "span":
            case "p":
            default:
                element = React.createElement(type,props,children);
                return element;
            case "a":
                // Object.assign(props, {className:'e_l', target:'_blank'});
                // element = React.createElement(type, props, children);
                element = <A props = {props} handleClick={(link,status)=>this.clickLink(link, status)} >{children}</A>
                return element;
            // 以下为 empty elements (no children) 的标签 
            case "img":
            case "hr":
            case "br":
            case "input":
            case "link":
            case "wbr":
            case "area":
            case "base":
            case "embed":
            case "keygen":
            case "meta":
            case "param":
            case "source":
            case "track":
                element = React.createElement(type,props);
                return element;
            // 以下为忽略的标签
            case "#comment":
            case "#document":
            case "script":
                return '';
            // 特殊处理
            case "svg":
                element = React.createElement(type, props);
                // element.dangerouslySetInnerHTML()
        }
    }

    handleAClick(e){
        console.log('click a tag - >', e);
        e.preventDefault();
        if(!this.state.showLinkDialog){
            this.setState({
                showLinkDialog:true
            })
        }
    }

    extractBehind(node){
        // 提取单词后半部分, 在标签首部，
        let getCross = false;
                
        if(node.nodeName == "#text"){
            // 文本 | 直接分割 返回

            let text = node.textContent;
            let cross, other;

            let splitList = text.split(/(^\w*)(.+$)/); 
            // splitList = ['','Hello',' World!','']
            cross = splitList[1] ? splitList[1] : '';
            other = splitList[2] ? splitList[2] : '';
            if(/[\W]/.test(other[0])) getCross = true;
            
            

            let otherWord = this.textSplit(other);
            console.log('return, cross, otherWord', cross,other)
            return [cross,otherWord]
                        
        }else{
            // 标签 | 遍历 分割 返回
            let c  = node.firstChild;
            let crossChildren = [];
            let otherChildren = [];

            while(c){
                if(getCross){
                    // 已提取交叉情况，并移出xmlDoc
                    console.log('app-262-traversal');
                    otherChildren.push(this.htmlTraversal(c))
                }else{
                    // 继续迭代
                    let [cross, other] = this.extractBehind(c)
                    crossChildren.push(cross);
                    otherChildren.push(other)
                }
                c = c.nextSibling;  // previousSibling
            }
            let type = node.nodeName.toLowerCase(); //.replace('body','div')
            let props = this.attToProps(node);
            let crossElement = this.createElement(type,props,crossChildren);

            let otherElement = this.createElement(type,props,otherChildren);
            // console.log('return, crossElement, otherElement', ReactDOMServer.renderToString(crossElement)," | ",ReactDOMServer.renderToString(otherElement))
            return [crossElement, otherElement]
        }
    }

    extractBothEnds(node){
        // console.log('extractBothEnds');
        let alterNode = true
        let frontCross = this.extractFront(node,alterNode)[0];
        let [behindCross,behindOther] = this.extractBehind(node);
        // console.log('behindCross',behindCross,'behindOther',behindOther,'frontCross', frontCross);
        return [behindCross,behindOther,frontCross]
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

    htmlTraversal(node){
        if(!node) return [];
        // console.log('htmlTraversal',node,node.nodeName)
        // let ignoreTag = ["script",'meta','link','#comment','#document','iframe'];
        // let mostCommon = ["DIV","P","SPAN"]
        switch(node.nodeName){
            case "DIV":
            case "P":
            case "SPAN":
            default:
                // 默认
                // let crossList = this.findCrossIndex(node);
                // console.log("crossList",node,crossList);
                let childrenList = [];

                let frontCross, frontOther;
                let haveCross = false;
                for(let i = 0; i < node.childNodes.length; i++){
                    let children = node.childNodes[i];
                    let haveCross2 = this.haveCrossWord(children, children.nextSibling);

                    // console.log('Cross Cross2', children, children.nextSibling, haveCross, haveCross2);
                    if(!haveCross && !haveCross2){
                        // console.log('app-362-traversal',children, children.length);
                        childrenList = childrenList.concat(this.htmlTraversal(children));
                        children = children.nextSibling;
                    }else if(haveCross && haveCross2){
                        // i all  前后都存在交叉情况
                        let [behindCross, middle, newFrontCross] = this.extractBothEnds(children);
                        console.log("middle", middle);
                        if(middle.props.children.length == 0){
                            frontCross = [frontCross].concat(newFrontCross);
                        }else if(middle.props.children[0].length < 1){
                            // 三交叉 behindCross is ''
                            // console.log('三交叉');
                            frontCross = [frontCross].concat(newFrontCross);
                        }else if(middle.props.children[0].length >= 1){
                            let word = this.getWord([frontCross,behindCross]);
                            childrenList = childrenList.concat(word).concat(middle);
                            frontCross = newFrontCross;
                            // frontCross = []
                        };
                    }else if(haveCross2){
                        // i - 1 front 暂存
                        [frontCross,frontOther] = this.extractFront(children);
                        childrenList = childrenList.concat(frontOther);
                    }else if(haveCross){
                        // i behind
                        let [behindCross,behindOther] = this.extractBehind(children);
                        let word = this.getWord([frontCross,behindCross]);;
                        childrenList = childrenList.concat(word).concat(behindOther);
                    };
                    haveCross = haveCross2;
                }
                let type = node.nodeName.toLowerCase();
    
                let props = this.attToProps(node);
                let element = this.createElement(type,props,childrenList);
                return element;
            case "#text":
                return this.textSplit(node.textContent);
            case "SCRIPT":
            case "#comment":
            case "#document":
            case "IFRAME":
                // 忽略
                return [];
            case "STYLE":
                // console.log('style tag->',node, node.innerText, node.scoped);
                return (<style>{node.innerText}</style>);
        }
    }

    getHeadCssText(head){
        if(!head) return '';
        let cssText = '';
        let styles = head.getElementsByTagName("style");
        for(let i=0; i < styles.length; i++){
            cssText = cssText + styles[i].innerText;
        }
        return cssText;
    }

    insertHead(head){
        /**提取head中的有用部分（link, style, ...）
         * DOM操作插入document.head中
         * 随着加载的文档越来越多， head中插入的也越来越多，干扰后续的阅读体验
         * 所以需要插入，也需要移除
         */
        for(let i=0; i < head.childNodes.length; i++){
            let node = head.childNodes[i]
            let type = node.nodeName;
            // console.log('nodeName', node, node.nodeName)
            // console.log('node src ->', node.href)

            // 相对链接转换为绝对
            if(node.href) node.href = node.href;
            if(node.src) node.src = node.src;

            switch(type){
                case "LINK":
                    // 黑名单
                    if([/manifest/,/icon/].findIndex((value)=>value.test(node.rel)) != -1) break;

                    //白名单
                    // if(![/stylesheet/,/preload/].findIndex((value)=>value.test(node.rel))) break;
                case "STYLE":
                    document.head.insertBefore(node, document.head.lastChild);
                    break;
            }
        }
    }

    extractHead(head){
        /** 提取head中的有用部分，复制，返回列表 */
        let list = [];
        for(let i=0; i < head.childNodes.length; i++){
            let node = head.childNodes[i]
            let type = node.nodeName;
            // console.log('nodeName', node, node.nodeName)
            // console.log('node src ->', node.href)

            // 相对链接转换为绝对
            if(node.href) node.href = node.href;
            if(node.src) node.src = node.src;

            switch(type){
                case "LINK":
                    // 黑名单
                    if([/manifest/,/icon/].findIndex((value)=>value.test(node.rel)) != -1) break;

                    //白名单
                    // if(![/stylesheet/,/preload/].findIndex((value)=>value.test(node.rel))) break;
                case "STYLE":
                    let props = this.attToProps(node);
                    list.push(this.createElement(type, props, node.innerText));
                    break;
            }
        }
        return list;
    }

    restoreHead(){
         if(this.storeOriginalHead === false){
             // 记录初始值
             this.storeOriginalHead = true;
             document.replaceChild(document.head, document.getElementById('headbackup').firstChild);
         }else{
             // 恢复初始值 
             console.log('orginalHead')
             document.replaceChild(document.getElementById('headbackup').firstChild, document.head);
         }
    }

    handleClickReadPanel(e){
        // console.log('handleClickReadPanel', e, e.target, e.target.className)
        if(e.target.className == "@w") return;
        if(this.state.showExplainPanel){
            this.setState({
                showExplainPanel:false
            });
        };

        if(this.state.showLinkDialog){
            this.setState({
                showLinkDialog:false
            });
        };
    }

    clickLink(link, status){
        console.log('click link', link, status)
        if(!link) return;
        this.externalLink = link;

        if(this.state.showLinkDialog == status) return;
        if(typeof(status) != 'boolean') return;
        this.setState({
            showLinkDialog:status
        });
    }

    readNewPage(){
        // this.props.history.push(`/r?url=${encodeURIComponent(this.externalLink)}`);
        this.props.setInput(this.externalLink, true);
    }

    // 生命周期函数
    componentDidMount(){
        console.log('componentDidMount')
        let that = this;
        // 窗口滚动事件
        let windowScroll = function(e){
            if(!that.state.showExplainPanel) return;
            that.setState({
                showExplainPanel:false
            });

            if(!that.state.showLinkDialog) return;
            that.setState({
                showLinkDialog:false
            })
        }
        window.addEventListener('scroll', windowScroll);

        // 给每个a标签绑定click监听事件, 阻止默认行为
        let aList = document.getElementById('wrp-app').getElementsByClassName('e_l');
        console.log('a length', aList.length)
        for(let i=0; i < aList.length; i++){
            let a = aList[i];
            a.addEventListener('click', (e)=>{
                console.log('click a tag - >', e);
                e.preventDefault();
                if(!that.state.showLinkDialog){
                    that.setState({
                        showLinkDialog:true
                    })
                }
                console.log('showLinkDialog - >', that.state.showLinkDialog);
                intervId = window.setInterval(()=>{
                    let time = that.state.linkDialogTimeCount;
                    console.log('interval', intervId, time);

                    if(that.state.linkDialogTimeCount > 0){
                        that.setState({
                            linkDialogTimeCount: time - 1
                        })
                    };
                    if(time == 0){
                        that.setState({
                            showLinkDialog: false
                        });
                        console.log('-')
                        clearInterval(intervId);
                    }
                },1000);

                that.setState({
                    linkDialogTimeCount:3
                })
            });
        }
        
    }

    indexRender(node){
        console.log('app-traversal');
        let t1 = Date.now()
        let htmlElements = this.htmlTraversal(node);
        let t2 = Date.now()
        console.log("traversal Runing time ", t2 - t1)
        // this.setState({
        //     htmlElements:htmlElements
        // });
        this.htmlElements = htmlElements;
        console.log('setState', this.htmlElements,htmlElements)
        this.doc = this.props.doc

        return htmlElements;
    }
    
    render(){

        console.log('App render ...', this.props.url)

        let htmlElements = this.htmlElements;

        if(this.props.doc != this.doc){
            // console.log('@@@@@@@@@',this.htmlElements);
            htmlElements = this.indexRender(this.props.doc.body);
            this.headCssText = this.getHeadCssText(this.props.doc.head);
            // 恢复head
            // this.restoreHead();
            // this. insertHead(this.props.doc.head);
            let headChildList = this.extractHead(this.props.doc.head);
            head(headChildList);
        }

        return(
            <div id="wrp-app">
                <style>{this.headCssText}</style>
                <ReadPanel
                    padding={!this.props.url}
                    content={htmlElements}
                    handleClick={(e)=>this.handleClickReadPanel(e)}
                />
                <ExplainPanel 
                    clickedWord={this.state.clickedWord} 
                    show={this.state.showExplainPanel}
                />
                <TranslatePanel 
                    translateTarget={this.state.translateTarget} 
                    clickWord={(w,e)=>this.handleClickWord(w,e)}
                />
                <div className={'wrp-link-dialog-box '.concat(this.state.showLinkDialog ? 'link-dialog-show' : '')} >
                    <Link to={`/r?url=${encodeURIComponent(this.externalLink)}`}>
                        <div className="wrp-nav-item wrp-ld-button" onClick={()=>this.readNewPage()}>
                            <svg className="wrp-nav-item-icon " viewBox="0 0 1024 1024" version="1.1" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M863 942H500.3L309.7 822.6c-33.8-21.2-54.9-60.7-54.9-103V162.5c0-30.4 14.5-57.6 38.7-72.9 24.4-15.4 53.6-15.4 78-0.1L507 174.3h356c52.9 0 96 46.9 96 104.6v558.4c0 57.8-43.1 104.7-96 104.7z m-345.6-69.8H863c17.6 0 32-15.6 32-34.9V278.9c0-19.2-14.4-34.9-32-34.9H489.9l-150.3-94.1c-6.4-4-12-1.3-14.1 0-2.5 1.6-6.7 5.3-6.7 12.6v557.1c0 17.5 8.7 33.8 22.8 42.5l175.8 110.1z" fill="#595959" p-id="4277"></path><path d="M508.8 942H161c-52.9 0-96-46.9-96-104.6V278.9c0-57.7 43.1-104.6 96-104.6h125.8v69.8H161c-17.6 0-32 15.6-32 34.9v558.4c0 19.2 14.4 34.9 32 34.9h347.8V942zM497.5 174.3h1v69.8h-1z" fill="#595959" p-id="4278"></path><path d="M480 209.2h64v697.2h-64z" fill="#595959" p-id="4279"></path></svg>
                            <div className="wrp-nav-item-title">阅读新页面</div>
                        </div>
                    </Link>
                    <a>
                        <div className="wrp-nav-item wrp-ld-button">
                            <svg className="wrp-nav-item-icon " viewBox="0 0 1024 1024" version="1.1" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M864 640a32 32 0 0 1 64 0v224.096A63.936 63.936 0 0 1 864.096 928H159.904A63.936 63.936 0 0 1 96 864.096V159.904C96 124.608 124.64 96 159.904 96H384a32 32 0 0 1 0 64H192.064A31.904 31.904 0 0 0 160 192.064v639.872A31.904 31.904 0 0 0 192.064 864h639.872A31.904 31.904 0 0 0 864 831.936V640z m-485.184 52.48a31.84 31.84 0 0 1-45.12-0.128 31.808 31.808 0 0 1-0.128-45.12L815.04 166.048l-176.128 0.736a31.392 31.392 0 0 1-31.584-31.744 32.32 32.32 0 0 1 31.84-32l255.232-1.056a31.36 31.36 0 0 1 31.584 31.584L924.928 388.8a32.32 32.32 0 0 1-32 31.84 31.392 31.392 0 0 1-31.712-31.584l0.736-179.392L378.816 692.48z" fill="#333333" p-id="1811"></path></svg>
                            <div className="wrp-nav-item-title">新窗口打开</div>
                        </div>
                    </a>
                    <span className="wrp-link-countdown">{this.state.linkDialogTimeCount}s</span>
                </div>
            </div>
        )
    }
}

export default App;

let AppWithRouter = withRouter(App);
export {AppWithRouter};