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

import TranslatePanel from './components/translatePanel';
import head from './head';
import A from './components/a';

var wrp = "wordReadingPro";

// import ReactDOMServer from 'react-dom/server';

// import getText from './text.js';
// import { isFulfilled } from 'q';
// import { throwError } from 'rxjs';

class App extends React.Component{
    constructor(props){
        super(props);
        /**props.url */
        this.state={
            showExplainPanel:false,
            showLinkDialog:false,
            clickedWord:{},
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
        this.sId = 0;
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

    //提取网页内容摘要
    extractAbstract(node){
        if(!node) return;
        let abstract = {};
        // icon
        let links = node.head.getElementsByTagName('link');
        for(let i =0; i < links.length; i++){
            let link = links[i];
            if(!link.rel)continue;
            if(link.rel.indexOf('icon') > 0){
                abstract.icon = link.href;
                break;
            }
        }
        // title
        let title = "";
        let docTitle =  node.head.getElementsByTagName('title')
        if(docTitle.length > 0){
            title = docTitle[0].textContent;
        }else{
            let docH1 = node.body.getElementsByTagName('h1');
            if(docH1.length > 0){
                title = docH1[0].textContent;
            }else{

            }
        }
        abstract.title = title;
        
        // description
        let pTags = node.getElementsByTagName('p');
        let description = "";
        for(let i = 0; i < pTags.length; i++){
            description = description + pTags[i].textContent.trim().slice(0,200);
            if(description.length >= 200) break;
        }

        let spanTags = node.getElementsByTagName("span");
        for(let i=0; i < spanTags.length; i++){
            description = description + spanTags[i].textContent.trim().slice(0,200);
            if(description.length >= 200) break;
        }

        if(!description) description = node.body.textContent.trim().slice(0,200);
        abstract.des = description;
        
        // console.log('摘要 描述',pTags, description);
    
        abstract.url = this.props.app.url;
        abstract.key = this.props.app.key;


        try{
            console.log('set history', abstract);
            this.props.setHistory(this.props.app.history, abstract);
        }catch(e){
            console.warn("", e);
        }
    }

    isInline(nodeName){
        const innerText = ['#text','b','i','em','s','small','u','strong','mark','span','code','a'];  // 移除'a'
        if(typeof(nodeName) != "string"){
            console.error('parameter type error, isInline() need string parameter!')
            // throw "parameter type error, isInline() need string parameter!"
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

    handleClickWord(e){

        this.extractScope.fn = 0;
        this.extractScope.bn = 0;
        let target = window.getSelection().anchorNode;
        let offset = window.getSelection().anchorOffset;

        if(!target.wholeText) return;

        let clickedChar = target.wholeText.slice(offset,offset+1);
        if(!/\w/.test(clickedChar)){
            this.hiddenSomeone('explainPanel');
            return;
        }
        let part = this.extractPart(target, offset,'word');
        // console.log(':part')
        let word = part[0].texts.join('') + part[1].texts.join('');
        console.log('check word ->',word)

        let position = {x:e.pageX, y:e.pageY, clientY:e.clientY};
        this.setState({
            clickedWord:{word:word,position:position},
            showExplainPanel:true
        })
        this.props.tapWord(word, position);
        this.props.loadWordData(word);
        console.log('handle click word')
        this.props.setExplShow(true);
    }

    translate(e){
        // console.log('translate',e, e.target, e.currentTarget,'\ndetail',e.detail,'\ntouches',e.touches,'\ntargetTouches',e.targetTouches,'\nchangedTouches',e.changedTouches,'\neventPhase',e.eventPhase)
        // console.log(window.getSelection());
        this.extractScope.fn = 0;
        this.extractScope.bn = 0;
        let target = e.target;
        let part = this.extractPart(target,null,'sentence');
        let sentence = part[0].texts.join('') + part[1].texts.join('');
        sentence = sentence.trim();
        console.log('sentence ->:', sentence);
        if(sentence.length < 3) return;
        this.translateText = {
            text:sentence,
            elements:[...part[0].elements,...part[1].elements]
        }
        this.setState({
            translateCount:this.state.translateCount + 1,
        })

    }

    getWord(content){
        return (
            <Word
                content = {content}
            />
            );
    }

    wordSplit(text){
        /**just #text ; 仅文本,不含其他标签 */
        if(!text) return [];
        let re = /\b/;
        let wordpattern = /\w+/;
        let List = [];
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

    sentenceSplit(text, node=null){
        /**just #text ; 仅文本,不含其他标签 */
        if(!text) return [];
        let pattern = /([\s\S]*?[.!?。！？\n\v\t]+)/;
        let splitList = text.split(pattern);
        let list = [];
        let onlyOneChild = node && node.parentNode && node.parentNode.childElementCount;
        if(splitList.length == 1 && parseInt(onlyOneChild) <= 1){
            return splitList;
        }
        let self = this;

        splitList.map((v)=>{
            if(/^\s*$/.test(v)){
                list.push(v)
            }else{
                
                list.push((<span key={'s' + self.sId}>{v}</span>));
                self.sId = self.sId + 1;
            }
        })

        return list;
    }

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

    // 待删除
    attToProps_old(content){
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

    attToProps(node){
        if(!node) return {};
        if(!node.attributes) return {};
        let props = {};
        for(let i = 0; i < node.attributes.length; i++){
            let att = node.attributes[i];
            let attName =att.name;
            let attValue = att.value;

            switch(attName){
                case "style":
                    attValue = this.styleConvert(node.style);
                    break;
                case "src":
                case "href":
                    // 大多默认为相对路径，需补全链接
                    attValue = node[attName];
                    break;
                case "srcset":
                    // 如何补全相对路径呢？这是一个问题，还有在css中的background-image:url()...
                    attValue = '';
                    break;
                case "class":
                    attName = "className";
                    break;
                // default:
                //     continue;
                // case "async":
                //     console.log('async', att.value);
                //     attName = ""
                //     attValue = "";
                //     break;
                case "for":
                    attName = "htmlFor";
                    break;
                case "tabindex":
                    attName = "tabIndex";
                    break;
                case "itemprop":
                    attName = "itemProp";
                    break;
                case "itemscope":
                    attName = "itemScope";
                    break;
                case "itemtype":
                    attName = "itemType";
                    break;
                case "xml:space":
                    attName = "xmlSpace";
                    break;
                case "fill-rule":
                    attName = "fillRule";
                    break
                case "clip-rule":
                    attName = "clipRule";
                    break
                case "autocapitalize":
                    attName = "autoCapitalize"
                    break;
                case "acceptcharset":
                    attName = "acceptCharset";
                    break;
                case "autocomplete":
                    attName = "autoComplete";
                    break;
                case "stroke-linecap":
                    attName = "strokeLinecap"
                    break;
                case "stroke-miterlimit":
                    attName = "strokeMiterlimit";
                    break;
                case "stroke-width":
                    attName = "strokeWidth";
                    break;
                case "stroke-linejoin":
                    attName = "strokeLinejoin";
                    break;
                case "crossorigin":
                    attName = "crossOrigin";
                    break;

            }
            // attName = attName.replace(/-([a-z])/g,(m,g)=>g.toUpperCase());
            props[attName] = attValue;
        }
        return props;
    }

    styleConvert(style){
        // style = element.style;
        let styleObj = {};
        for(let i=0; i < style.length; i++){
            let styleKey = style[i].replace(/-([a-z])/g,(m,g)=>g.toUpperCase())
            styleObj[styleKey] = style[style[i]];
        }
        // console.log("App.js: styleConvert() style:", style, "obj:", styleObj);
        return styleObj;
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
            
            let otherWord = this.wordSplit(other);
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

        switch(type){
            case "div":
            case "span":
            case "p":
                element = React.createElement(type,props,children);
                return element;
            case "a":
                props['data-src'] = props.href;
                delete props.href;
                element = (<A
                    props = {props} 
                    clickLink={(link,status)=>this.clickLink(link, status)}
                    clickWord={(e)=>this.handleClickWord(e)}
                >{children}</A>);
                return element;
            // 以下为 empty elements (no children) 的标签
            case "input":
                // 存在value属性导致无法输入
                delete props.value;
            case "img":
            case "hr":
            case "br":
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
                // return '';
                if(!this.config.runScript) return '';
                if(props.src) props["data-href"] = props.src;
                delete props.src;
                element = React.createElement(type, props, children);
                return element;
            // 特殊处理
            case "svg":
                element = React.createElement(type, props, children);
                // element.dangerouslySetInnerHTML()
                return element;
            case "body":
                element = React.createElement('div',props, children);
                return element;
            case "col":
                return (<col {...props}></col>);
            case "textarea":
                if(children.length > 1) console.warn('React.reactElememt() Error! <textarea> tag only requests one children.')
                // element = React.createElement('div',props, children[0]);
                element = React.createElement('textarea',props, children[0]);
                return element;
            default:
                try{
                    element = React.createElement(type,props,children);
                    return element;
                }catch(e){
                    console.log('React.createElement() Error on create "', type, '" tag!')
                }
                
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
            
            

            let otherWord = this.wordSplit(other);
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
        let type, props, element;
        switch(node.nodeName){
            case "DIV":
            case "P":
            case "SPAN":
            case "A":
            default:
                let childrenList = [];
                let frontCross, frontOther;
                let haveCross = false;
                if(this.config.splitWord){
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
                        children = null;
                    }
                }else{
                    for(let i = 0; i < node.childNodes.length; i++){
                        let children = node.childNodes[i];
                        childrenList = childrenList.concat(this.htmlTraversal(children));
                    }
                }
                
                type = node.nodeName.toLowerCase();
    
                props = this.attToProps(node);
                element = this.createElement(type,props,childrenList);
                return element;
            case "#text":
                if(this.config.splitWord){
                    return this.wordSplit(node.textContent);
                }else if(this.config.splitSentence){
                    return this.sentenceSplit(node.textContent, node);
                }else{
                    return node.textContent;
                }
            case "#comment":
            case "#document":
            case "IFRAME":
                // 忽略
                return [];
            case "STYLE":
                // console.log('style tag->',node, node.innerText, node.scoped);
                type = node.nodeName.toLowerCase();
    
                props = this.attToProps(node);
                element = this.createElement(type,props,node.innerText);
                return element;
            case "SCRIPT":
                type = node.nodeName.toLowerCase();
    
                props = this.attToProps(node);
                element = this.createElement(type,props,node.innerText);
                return element;
        }
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

    // 未使用
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
        if(!head)return list;
        let base = false;
        for(let i=0; i < head.childNodes.length; i++){
            let node = head.childNodes[i]
            let type = node.nodeName;
            // console.log('nodeName', node, node.nodeName)
            // console.log('node src ->', node.href)

            if(type === 'BASE'){
                base = true
            };

            // 相对链接转换为绝对
            if(node.href) node.href = node.href;
            if(node.src) node.src = node.src;

            switch(type){
                case "LINK":
                    // 黑名单
                    if([/manifest/,/icon/].findIndex((value)=>value.test(node.rel)) != -1) break;

                    //白名单
                    // if(![/stylesheet/,/preload/].findIndex((value)=>value.test(node.rel))) break;

                    list.push(this.createElement(type, this.attToProps(node), node.innerText));
                    break;
                case "STYLE":

                    // list.push(this.createElement(type, this.attToProps(node), node.innerText));
                    list.push(<style>{node.innerText}</style>);
                    break;

                case "SCRIPT":
                    // list.push(<script >{node.innerText}</script>);
                    list.push( this.createElement('script',this.attToProps(node), node.innerText) );
                    break;

                case "TITLE":
                // 忽略
                case "#text":
                // case "SCRIPT":
                default:
                    break;
            }
        }
        
        // if(!base)list.push(this.createBaseTag());
        return list;
    }

    createBaseTag(){
        let url = this.props.url;
        if(url){
            if(/^https?:\/\/(.+\.\w+.*)|(localhost.*)/.test(url)){
                // let origin = url.match(/^(https?:\/\/[\w\.]+)\/?.*$/)[1];
                return (<base href={url} />);
            }
        }
        return '';
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

    // 寻找分割的断点位置
    findSubPart(text,direction,pattern){
        /**front 单词模板pattern /^[\s\S]*\W(\w*?)$/
         * behind 单词模板pattern /^(\w*?)\W[\s\S]*$/
         */
        let subPart;
        if(direction == 'front'){
            // let pattern = /^[\s\S]*\W(\w*?)$/;
            subPart = text.match(pattern);
            // console.log('match', subPart);
            if(subPart != null){
                this.extractScope.fn += 1;
                subPart = subPart[1];
            }else{
                subPart = text;
            }
        }else{
            // behind
            // let pattern = /^(\w*?)\W[\s\S]*$/;
            subPart = text.match(pattern);
            // console.log('match', subPart, pattern);

            if(subPart != null){
                this.extractScope.bn += 1;
                subPart = subPart[1];
            }else{
                subPart = text;
            }
        }
        // console.log('subPart', subPart)
        // const end = /[.。!！?？]/
        return subPart;
    }

    frontFind(target, offset, testParent=true,pattern){
        // 向前遍历节点 查找翻译起点
        // console.log('f')
        let result = {
            texts:[],
            elements:[],
            break:false
        }
        if(!target) return result;
        while(target){
            // console.log("front, while", target,result.texts);
            if(target.nodeName == "#text"){
                let text
                if(offset){
                    text = target.textContent.slice(0,offset);
                }else{
                    text = target.textContent;
                }
                // console.log('front text', text, target)
                let subPart = this.findSubPart(text,'front',pattern);
                // console.log('subPart', subPart)
                if(this.extractScope.front == this.extractScope.fn){
                    result.texts.unshift(subPart);
                    result.elements.unshift(subPart);
                    // console.log('break')
                    result.break = true;
                    break;
                }else{
                    subPart = text;
                    result.texts.unshift(subPart);
                    result.elements.unshift(subPart);
                }
            }else if(target.nodeName == "SPAN"){
                if(target.classList[0] == "@w"){
                    // Word
                    result.texts.unshift(target.textContent);
                    result.elements.unshift(this.copyWord(target));
                }else{
                    // 需要遍历子节点
                    let children = this.frontFind(target.lastChild,null,false,pattern);
                    result.texts.unshift(...children.texts);
                    result.elements.unshift(this.copy(target,children.elements));
                    result.break = children.break;
                    if(children.break) break;
                }
            }else if( !this.isInline(target.nodeName)){
                break;
            }else{
                // 其他标签， 遍历子节点
                let children = this.frontFind(target.lastChild,null,false,pattern);
                // console.log("front children", children)
                result.texts.unshift(...children.texts);
                result.elements.unshift(this.copy(target,children.elements));
                result.break = children.break;
                if(children.break) break;
            }

            // 偶尔因target.parentName undefined 出错;
            if(!target.previousSibling && this.isInline(target.parentNode.nodeName) && testParent){
                target = target.parentNode.previousSibling;
            }else{
                target = target.previousSibling;
            }
            offset = null;
        }
        return result;
    }

    behindFind(target,offset, testParent=true,pattern,driectTarget=false){
        // 向后遍历节点  查找翻译终点 
        // console.log('behindFind -start,',target)
        let result = {
            texts:[],
            elements:[],
            break:false,
        }
        if(!target) return result;
        if(!offset) offset = 0;
        while(target){
            console.log("next, while", target);
            if(target.nodeName == "#text"){
                let text = target.textContent.slice(offset);
                console.log('behind text', text,target,offset,target.textContent)

                let subPart = this.findSubPart(text,'behind',pattern);
                if(this.extractScope.behind == this.extractScope.bn){
                    result.texts.push(subPart);
                    result.elements.push(subPart);
                    result.break = true;
                    console.log('break')
                    break;
                }else{
                    subPart = text;
                    result.texts.push(subPart);
                    result.elements.push(subPart);
                }
            }else if(target.nodeName == "SPAN"){
                if(target.classList[0] == "@w"){
                    // Word
                    result.texts.push(target.textContent);
                    result.elements.push(this.copyWord(target));
                }else{
                    // 需要遍历子节点
                    let children = this.behindFind(target.firstChild,0,false,pattern);
                    result.texts.push(...children.texts);
                    result.elements.push(this.copy(target,children.elements));
                    result.break = children.break;
                    if(children.break) break;
                }
            }else if( !this.isInline(target.nodeName) && !driectTarget){
                break;
            }else{
                // 其他标签， 遍历子节点
                let children = this.behindFind(target.firstChild,0,false,pattern);
                result.texts.push(...children.texts);
                result.elements.push(this.copy(target,children.elements));
                result.break = children.break;
                if(children.break) break;
            }

            if(!target.nextSibling && this.isInline(target.parentNode.nodeName) && testParent){
                target = target.parentNode.nextSibling;
            }else{
                target = target.nextSibling;
            }
            offset = 0;
        }
        return result;
    }

    // 从html中提取部分文字区域， 例如：单词，句子
    extractPart(target, offset, type='word'){
        if(!target) return['',''];
        // console.log('translate test',target);
        let frontPattern;
        let behindPattern;
        if(type == 'word'){
            frontPattern = /^[\s\S]*\W(\w*?)$/;
            behindPattern = /^(\w*?)\W[\s\S]*$/;
        }else if(type=='sentence'){
            frontPattern = /^[\s\S]*[.!?。！？\v\t]([\s\S]*?)$/;
            behindPattern = /^([\s\S]*?[.!?。！？\v\t])[\s\S]*$/;
        }
        let frontTarget = target;
        if(offset == null){
            frontTarget = target.previousSibling;
            if(!this.isInline(target.nodeName)){
                frontTarget = null;
            }
        }
        // console.log('a',frontTarget,offset)
        let front = this.frontFind(frontTarget,offset,true,frontPattern);
        // console.log('go -1 front',front,'go -2');
        let behind = this.behindFind(target,offset,true,behindPattern,true);
        // console.log('go -2 behind',behind,'go -end');
      
        return [front, behind];
    }

    copy(content,children){
        // Element、Children 为React Element
        let type = content.nodeName.toLowerCase();
        let props = this.attToProps(content);
        let element = React.createElement(type,props,...children);
        return element;
    }

    deepCopy(node,returnChilren=false){
        
        if(node.nodeName == '#text') return node.textContent;

        let children = node.firstChild;
        let childrenList = [];
        while(children){
            childrenList = childrenList.concat(this.deepCopy(children));
            children = children.nextSibling;
        }


        if(returnChilren){
            return childrenList;
        }else{

            let type = node.nodeName.toLowerCase();
            const ignoreTag = ['#comment'];

            if(ignoreTag.includes(type)){
                return '';
            }

            let props = this.attToProps(node);
            const noChildren = ['img','hr','br','input','link','wbr'];

            if(noChildren.includes(type)){
                let element = React.createElement(type,props);
                return element;
            }
            
            let element = React.createElement(type,props,childrenList);
            return element;
        }
        
    }

    copyWord(word){
        // copy Word, 由Word渲染后的span便签copy Word
        // word可能含有子标签，需要遍历复制
        let childrenList = this.deepCopy(word,true);
        return(
            <Word
                content={childrenList}
                handleClick={(e,w)=>{this.props.clickWord(e,w)}}
                translate={()=>{}}
            />
        )
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

    docParser(doc){
        // console.log('app-traversal');
        
        let t1 = Date.now()
        let node = (new DOMParser()).parseFromString(doc, 'text/html')
        let base = node.createElement('base');
        console.log('base app.url', this.props.app.url)
        base.href = new URL(this.props.app.url).origin; 
        node.head.insertBefore(base, node.head.firstChild);

        let htmlElements = this.htmlTraversal(node.body);
        let t2 = Date.now()
        console.log("traversal Runing time ", t2 - t1)

        this.htmlElements = htmlElements;
        this.abstract = null;

        // 提取head， 渲染head
        let headChildList = this.extractHead(node.head);
        head(headChildList);
        this.extractAbstract(node);
        window.scrollTo(0, 0);


        try{
            console.log('setStatus ->', 'completed');
            this.props.setStatus('completed');
        }catch(e){
            console.error(e);
        }

        return htmlElements;
    }
    
    render() {
        let htmlElements = this.htmlElements;
        console.log('App.js: render()  status = ', this.props.app.status)
        if(this.props.app.status == 'parsing'){
            htmlElements = this.docParser(this.props.app.xmlDoc);
        }

        console.log(`html elements: ${this.htmlElements}`)

        return(
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
                        translateText = {this.translateText}
                        translateCount ={this.state.translateCount}
                        clickWord={(e)=>this.handleClickWord(e)}
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
        )
    }

    checkURI(){
        console.log('webApp.js: checkURI()');

        let urlParams = (new URL(window.location.href)).searchParams;
        let url = urlParams.get('url');
        let key = urlParams.get('key');

        if(key){
            let doc = localStorage.getItem(key);
            this.props.setXmlDoc(doc)
            this.props.setStatus('parsing')
        }

        if (url === this.props.app.url && this.htmlElements.length !== 0) {
            
        }

        if (url === this.props.app.url && this.htmlElements.length === 0) {
            this.props.setStatus('parsing')
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
        // 窗口滚动事件
        let windowScroll = function(e){
            if(!self.state.showExplainPanel) return;

            console.log('window scroll')
            self.props.setExplShow(false)

            if(!self.state.showLinkDialog) return;
            self.props.setAShow(false)
        }
        window.addEventListener('scroll', windowScroll);
        // 路由监听
        this.props.history.listen(location => {
            console.log('history.listen',location, window.location)
            let url = new URLSearchParams(window.location.search).get('url')
            if (this.props.app.status !== 'loading') {
                // this.props.setStatus('loading')
                // this.props.loadXmlDoc(url)
                this.checkURI()
            }
        })
    }

    async componentDidUpdate(){

        console.log('App.js componentDidUpdate')
        console.log('this.docId', this.docId, "this.props.docId",this.props.docId);

        if(this.docId != this.props.docId && this.props.status === "completed"){

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
    tapWord: (word, coordinate) => {
        dispatch(explActions.tapWord(word, coordinate))
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