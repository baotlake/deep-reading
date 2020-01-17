import React from 'react';
import './App.css';
import Word from './components/word.js';
import ReadPanel from './components/readPanel.js';
import ExplainPanel from './components/explainPanel.js';
import TranslatePanel from './components/translatePanel.js';

import ReactDOMServer from 'react-dom/server';


// import getText from './text.js';
import { isFulfilled } from 'q';
import { throwError } from 'rxjs';


var doc;
var traversal = false;

// myConsole.log()
const myConsole = {
    printLog:false,
    // printLog:true,
    log:function(...args){
        if(!this.printLog) return
        console.log(...args)
    }
}


class App extends React.Component{
    constructor(props){
        super(props);
        this.state={
            showExplainPanel:false,
            clickedWord:{},
            translateTarget:null,
        };
        this.doc = null;
        this.htmlElements = [];
        this.headCssText = '';
    }

    // translatePanel.js 需要
    isInline(nodeName){
        const innerText = ['#text','b','i','em','s','small','u','strong','mark','span','a']
        if(!typeof(nodeName) == "string"){
            throw "parameter type error, isInline() need string parameter!"
            // return false
        }
        // console.log('toLowerCase', nodeName)
        if(innerText.includes(nodeName.toLowerCase())){
            return true;
        }else{
            return false;
        }
    }

    hasCrossWord(node,node2){
        // console.log('HasCrossWord,',node, node2)
        let nodeLastChar;
        let node2FirstChar;
        if(node && node2){
            if(!this.isInline(node.nodeName) || !this.isInline(node2.nodeName)){
                return false;
            }
            node2FirstChar = node2.textContent[0];
            nodeLastChar = node.textContent[node.textContent.length - 1];
        }else{
            return false;
        }
        let re = /[a-zA-Z0-9_-]/
        if(re.test(nodeLastChar) && re.test(node2FirstChar)){
            return true;
        }else{
            return false;
        }
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
                List.push(
                <Word
                    content = {w}
                    handleClick={(w,e)=>this.handleClickWord(w,e)}
                    translate={(e)=>this.test2(e)}
                />
                )
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
        if(!content.style) return {};
        let props = {};
        let cssText = content.style.cssText;
        props['style'] = this.styleFormat(cssText);

        let classList = content.classList;
        // console.log('classLIst', classList)
        if(content.id) props['id'] = content.id;
        if(classList) props.className = classList.value;
        if(content.href) props['href'] = content.href;
        if(content.hidden != null) props['hidden'] = content.hidden;
        if(content.src) props['src'] = content.src;
        if(content.width) props['width'] = content.width;
        if(content.height) props['height'] = content.height;
        if(content.nodeName == "IMG") props.style.maxWidth = '100%';

        return props;
    }

    extractFront(node,alterNode){
        // 提取单词前半部分, 在标签尾部，
        let getCross = false;
                
        if(node.nodeName == "#text"){
            // 文本 | 直接分割 返回

            let text = node.textContent;
            let cross, other;

            let splitList = text.split(/(\w+$)/); 
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
            case "img":
            case "hr":
            case "br":
            case "input":
            case "link":
            case "wbr":
                element = React.createElement(type,props);
                return element;
            case "#comment":
            case "#document":
            case "script":
                return '';
        }
    }

    extractBehind(node){
        // 提取单词后半部分, 在标签首部，
        let getCross = false;
                
        if(node.nodeName == "#text"){
            // 文本 | 直接分割 返回

            let text = node.textContent;
            let cross, other;

            let splitList = text.split(/(^\w+)(.+$)/); 
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
    
    findCrossIndex(node){
        /** node为父标签，判断子标签的交叉情况
         *  index 表示该标签的*前*半部分 上个标签的后部分 有交叉情况
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
                // console.log("crossList",node,crossList)
                let childrenList = [];
    
                let frontCross,frontOther;
                let hasCross = false;
                for(let i = 0; i < node.childNodes.length; i++){
                    let children = node.childNodes[i]
                    let hasCross2 = this.hasCrossWord(children, children.nextSibling);

                    if(!hasCross && !hasCross2){
                        // console.log('app-362-traversal',children, children.length);
                        childrenList = childrenList.concat(this.htmlTraversal(children));
                        children = children.nextSibling;
                    }else if(hasCross && hasCross2){
                        // i all  前后都存在交叉情况
                        let [behindCross, middle, newFrontCross] = this.extractBothEnds(children);
                        console.log("middle", middle)
                        if(middle.props.children.length == 0){
                            frontCross = [frontCross].concat(newFrontCross)
                        }else if(middle.props.children[0].length < 1){
                            // 三交叉 behindCross is ''
                            // console.log('三交叉')
                            frontCross = [frontCross].concat(newFrontCross)
                        }else if(middle.props.children[0].length >= 1){
                            let word = (<Word
                                content={[frontCross,behindCross]}
                                handleClick={(w,e)=>this.handleClickWord(w,e)}
                                translate={(e)=>this.test2(e)}
                            ></Word>);
                            childrenList = childrenList.concat(word).concat(middle);
                            frontCross = newFrontCross;
                            // frontCross = []
                        }
                    }else if(hasCross2){
                        // i - 1 front 暂存
                        [frontCross,frontOther] = this.extractFront(children);
                        childrenList = childrenList.concat(frontOther);
                    }else if(hasCross){
                        // i behind
                        let [behindCross,behindOther] = this.extractBehind(children);
                        let word = (<Word
                            content={[frontCross,behindCross]}
                            handleClick={(w,e)=>this.handleClickWord(w,e)}
                            translate={(e)=>this.test2(e)}
                        ></Word>);
                        childrenList = childrenList.concat(word).concat(behindOther);
                    }
                    hasCross = hasCross2;
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
        let cssText = '';
        let styles = head.getElementsByTagName("style");
        for(let i=0; i < styles.length; i++){
            cssText = cssText + styles[i].innerText;
        }
        return cssText;
    }

    // test
    indexRender(node){
        console.log('app-379-traversal');
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

        // this.traversal = true;
        traversal = true;

        return htmlElements;
    }

    render(){

        let htmlElements = this.htmlElements;

        // console.log("######### htmltraversal #########", htmlElements,!htmlElements.props, this.props.doc)
        if(!this.htmlElements.props){  // || this.props.doc !== this.doc
            console.log('@@@@@@@@@',this.htmlElements);
            htmlElements = this.indexRender(this.props.doc.body);
            this.headCssText = this.getHeadCssText(this.props.doc.head);
        }


        return(
            <div id="app">
                <style>{this.headCssText}</style>
                <ReadPanel
                    content={htmlElements}
                />
                <ExplainPanel clickedWord={this.state.clickedWord} show={this.state.showExplainPanel}/>
                <TranslatePanel translateTarget={this.state.translateTarget} />
            </div>
        )
    }
}

export default App;