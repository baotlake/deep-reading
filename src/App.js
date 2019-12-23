import React from 'react';
import './App.css';
import Word from './components/word.js';
import ReadPanel from './components/readPanel.js';
import ExplainPanel from './components/expainPanel.js';
import TranslatePanel from './components/translatePanel.js';

import ReactDOMServer from 'react-dom/server';


import getText from './text.js';
import { isFulfilled } from 'q';
import { throwError } from 'rxjs';


var doc

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
        super(props)
        this.state={
            parsed:[],
            test:{
                p:{x:100,y:100}
            },
            translateTarget:null,
        }
    }

    isInline(nodeName){
        const innerText = ['#text','b','i','em','s','small','u','strong','mark','span']
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

    test(w,p){
        this.setState({
            test:{
                w:w,
                p:p
            }
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
        let wordpattern = /\w+/
        let List = [];
        // myConsole.log('---->', typeof(text))
        let splitList = text.split(re)
        for(let w of splitList){
            if(wordpattern.test(w)){
                List.push(
                <Word
                    content = {w}
                    handleClick={(w,e)=>this.test(w,e)}
                    translate={(e)=>this.test2(e)}
                />
                )
            }else{
                List.push(w)
            }
        }

        return List
    }

    styleFormat(cssText){
        myConsole.log("cssText",cssText)
        if(cssText != ""){
            cssText = cssText.replace(/:\s*/g, '":"')
            cssText = cssText.replace(/;\s*/g, '","')
            cssText = '{"' + cssText + '"}'
            cssText = cssText.replace(/,""/g, '')
            // 还需要对一些内容进行替换，比如 border-radius 替换为borderRadius

            let style = JSON.parse(cssText)
            myConsole.log("cssText",cssText,typeof(cssText))
            myConsole.log('style ->', style)

            return style
        }
        return {}
    }

    attToProps(content){
        let props = {};
        console.log("attToProps", content, typeof(content), content.nodeName)
        let cssText = content.style.cssText
        props['style'] = this.styleFormat(cssText);

        myConsole.log('style-->',cssText)
        let classList = content.classList
        if(content.href) props['href'] = content.href
        if(content.hidden != null) props['hidden'] = content.hidden
        if(content.src) props['src'] = content.src;

        return props
    }


    a(node, direction){
        // 提取交叉部分和其他部分
        let getCross = false;
        
        if(node.nodeName == "#text"){
            // 文本 | 直接分割 返回

            let text = node.textContent;
            let cross;
            let other;
            if(direction == "behind" && getCross == false){
                let splitList = text.split(/(^\w+)(.+$)/); 
                // splitList = ['','Hello',' World!','']
                cross = splitList[1] ? splitList[1] : '';
                other = splitList[2] ? splitList[2] : '';
                if(/[\W]/.test(other[0])) getCross = true;
            }else if(direction == "front" && getCross == false){
                let splitList = text.split(/(\w+$)/); 
                // splitList = [Hello ','World']
                other = splitList[0] ? splitList[0] : '';
                cross = splitList[1] ? splitList[1] : '';
                // console.log("a other cross text", other,cross,text)
                if(/[\W]/.test(other[other.length - 1])) getCross = true;
            }else if(direction == "all" && getCross == false){

            }else if(getCross == true){
                cross = '';
                other = text
            }

            let otherWord = this.textSplit(other);
            console.log('return, cross, otherWord', ReactDOMServer.renderToString(cross),ReactDOMServer.renderToString(otherWord))
            return [cross,otherWord]       
                        
        }else{
            // 标签 | 遍历 分割 返回
            let c
            if(direction == "behind"){
                c = node.firstChild;
            }else if(direction == "front"){
                c = node.lastChild;
            }
            let crossChildren = [];
            let otherChildren = [];

            while(c){
                // 迭代
                let [cross,otherWord,bcross,botherWord] = this.a(c, direction);
                crossChildren = crossChildren.concat(cross);
                otherChildren = otherChildren.concat(otherWord);
                // console.log('get return',  ReactDOMServer.renderToString(crossChildren),  ReactDOMServer.renderToString(otherChildren));
                if(direction == "behind"){
                    c = c.nextSibling;  // previousSibling
                }else if(direction == "front"){
                    c = c.previousSibling;  // previousSibling
                }
            }
            // console.log('Children', crossChildren,otherChildren)
            let type = node.nodeName.toLowerCase(); //.replace('body','div')
            let props = this.attToProps(node);
            let otherElement = React.createElement(type,props,otherChildren);
            let crossElement = React.createElement(type,props,crossChildren);
            // console.log('return, crossElement, otherElement', ReactDOMServer.renderToString(crossElement),ReactDOMServer.renderToString(otherElement))
            return [crossElement, otherElement]
        }
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
                let newNode = doc.createTextNode(other)
                node.parentNode.replaceChild(newNode, node)
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
            let crossElement = React.createElement(type,props,crossChildren);

            let otherElement = React.createElement(type,props,otherChildren);
            // console.log('return, crossElement, otherElement', ReactDOMServer.renderToString(crossElement),ReactDOMServer.renderToString(otherElement))
            return [crossElement, otherElement]
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
            let crossElement = React.createElement(type,props,crossChildren);

            let otherElement = React.createElement(type,props,otherChildren);
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
        return indexList;
    }

    htmlTraversal(node){
        console.log('htmlTraversal',node)
        if(node.nodeName == "#text"){
            return this.textSplit(node.textContent);
        }else{
            let crossList = this.findCrossIndex(node);
            console.log("crossList",node,crossList)
            let childrenList = [];

            let frontCross,frontOther;
            for(let i = 0; i < node.childNodes.length; i++){
                let children = node.childNodes[i]
                if(crossList.includes(i) && crossList.includes(i + 1)){
                    // i all
                    let [behindCross, middle, newFrontCross] = this.extractBothEnds(children);
                    console.log("middle", middle)
                    if(middle.props.children[0].length >= 1){
                        let word = (<Word
                            content={[frontCross,behindCross]}
                            handleClick={(w,e)=>this.test(w,e)}
                            translate={(e)=>this.test2(e)}
                        ></Word>);
                        childrenList = childrenList.concat(word).concat(middle);
                        frontCross = newFrontCross;
                        // frontCross = []
                    }else{
                        // 三交叉 behindCross is ''
                        // console.log('三交叉')
                        frontCross = [frontCross].concat(newFrontCross)
                    }
                }else if(crossList.includes(i + 1)){
                    // i - 1 front 暂存
                    [frontCross,frontOther] = this.extractFront(children);
                    childrenList = childrenList.concat(frontOther);
                }else if(crossList.includes(i)){
                    // i behind
                    let [behindCross,behindOther] = this.extractBehind(children);
                    let word = (<Word
                        content={[frontCross,behindCross]}
                        handleClick={(w,e)=>this.test(w,e)}
                        translate={(e)=>this.test2(e)}
                    ></Word>);
                    childrenList = childrenList.concat(word).concat(behindOther);
                }else{
                    childrenList = childrenList.concat(this.htmlTraversal(children));
                    children = children.nextSibling;
                }
            }
            let type = node.nodeName.toLowerCase();
            const ignoreTag = ['#comment']
            if(ignoreTag.includes(type)){
                return ''
            }

            let props = this.attToProps(node);

            const noChildren = ['img','hr','br','input','link']
            if(noChildren.includes(type)){
                let element = React.createElement(type,props);
                return element;
            }
            
            let element = React.createElement(type,props,childrenList);
            return element;
        }
    }

    


    tagTraversal(content){
        /*先判断content是否包含子标签 */
        let Element       // react Element
        let Children = []       // react Element Children
        if(typeof(content.innerHTML) == 'string'){

            //myConsole.log('innerHTML')
            /*文字标签混合，情况复杂 */
            // myConsole.log('nodeName->', content.nodeName)
            let crossWordindex = -2;
            /** has cross word 是否存在‘交叉情况’ 
             * 所谓的交叉是指一个单词被分分隔在两个兄弟标签中
             * 如: <b>dev<b/><i>eloper<i/> 
             */
            let CrossWord;
            let CrossWordParent;
            let childNodes = content.childNodes;
            let cross, other;
            let bcross, bother

            for(let i = 0; i < childNodes.length; i++){
                myConsole.log("-=-=- childNodes",childNodes[i].innerHTML," i:", i, 'crossWordindex:',crossWordindex,"i type:", typeof(childNodes))
                myConsole.log("nodeName ", childNodes[i].nodeName, typeof(childNodes[i]))
                myConsole.log("textContent", childNodes[i].textContent, typeof(childNodes[i].textContent))
                try{
                    myConsole.log("next", childNodes[i + 1].innerHTML)    
                }catch{

                }


                if(childNodes[i].textContent == undefined){
                    continue
                }

                if(i - crossWordindex == 0){
                    // 首部存在
                    /***
                     * *behind*, *front*, 一律指代单词的*后半部分*，*前半部分*
                     */
                    if(this.hasCrossWord(childNodes[i], childNodes[i].nextSibling)){
                        crossWordindex = parseInt(i) + 1;
                        // 首尾同时存在

                        [bcross,bother] = this.a(childNodes[i],'behind')
                        if(/\w+/.test(childNodes[i].textContent)){
                            // 三交叉
                            cross = cross.concat(bcross);
                            bcross = [];
                            continue
                        }
                        //else{
                            // 首位同时存在，*非三交叉*
                            // 同仅尾部存在一同处理
                            // 💚💙
                            // 
                        //}
                    }else{
                        // 仅首部存在
                        // 💚
                    }

                    /** 首部交叉，获取font, 提取behind,
                     * 💚
                     */
                    if(childNodes[i].textContent != ''){
                        [bcross,bother] = this.a(childNodes[i], 'behind')
                        console.log('bcross, bother', bcross, bother)
                    }else{
                        // myConsole.log('???', childNodes[i].textContent)
                        // console.log('else cross, other', childNodes[i].textContent,childNodes[i])
                    }


                    let crossWord = <Word
                        content={[cross,bcross]}
                        handleClick={(w,e)=>this.test(w,e)}
                        translate={(e)=>this.test2(e)}
                    />
                    Children = Children.concat(other,crossWord,bother)
                    console.log('pai xu',ReactDOMServer.renderToString(other)," | ",ReactDOMServer.renderToString(cross)," | ",ReactDOMServer.renderToString(bcross)," | ", ReactDOMServer.renderToString(other))
                    cross = []; other = []; bcross = []; bother = [];
                }

                if(this.hasCrossWord(childNodes[i], childNodes[i].nextSibling)){
                    // 仅文本尾部存在交叉情况crossword💙
                    crossWordindex = parseInt(i) + 1;
                    // console.log('set hasCrossWord',childNodes[i], childNodes[i].nextSibling,'----set end---',crossWordindex)

                    /**提取单词前半部分
                     * 如果有内容 -> 暂存
                    */
                   // console.log('tag', childNodes[i])
                   // console.log('bcross, bother',childNodes[i]);
                   [cross,other] = this.a(childNodes[i],'front');
                   console.log('cross, other',childNodes[i], ReactDOMServer.renderToString(cross), ReactDOMServer.renderToString(other));
                   continue;
                }

                if(i - crossWordindex == 0) continue;

                /**不存在交叉情况 */

                if(childNodes[i].nodeName == '#text'){
                    // 对纯文本内容进行替换
                    let word = this.textSplit(childNodes[i].textContent)
                    Children.push(word)
                    // myConsole.log('word', word)
                }else{
                    // 标签
                    myConsole.log('else -> "',childNodes[i].innerHTML,'"「', typeof(childNodes[i]),"」")
                    // myConsole.log('if', typeof(childNodes[i]) == 'object')

                    if(typeof(childNodes[i]) == 'object'){
                        myConsole.log('test nodeName 「', childNodes[i].nodeName, '」')
                        // childNodes[i].innerHTML = this.tagTraversal(childNodes[i])       // innerHTML
                        Children.push(this.tagTraversal(childNodes[i]))                     // React Element

                    }else{
                        // for 循环采用of, 导致length,之类其他属性循环进来

                        myConsole.log('what? ->', childNodes[i].innerHTML)
                        // break ???
                        break
                    }

                    // testList.push(this.tagTraversal(childNodes[i]))
                    // this.tagTraversal(childNodes[i])
                }

                // test
                try{
                    // myConsole.log('--------------\n', childNodes[i])
                    // // ReactDOM.hydrate(<Word/>,childNodes[i])
                    // ReactDOM.render(<Word/>,childNodes[i])
                    // myConsole.log(childNodes[i])
                }catch{

                }

            }
            // content.childNodes = childNodes;
            // myConsole.log('here childNodes ->', childNodes)
        }else{
            myConsole.log('text', content.textContent)
            /*可以直接由空格分词 */
            let word = this.textSplit(content.textContent)
            Children = Children.concat(word)
        }

        // 莫名出现body标签，对其进行替换
        let type = content.nodeName.toLowerCase();
        let props = this.attToProps(content)
        Element = React.createElement(type,props,Children)


        myConsole.log('Element ->', Element)

        // return content.innerHTML;
        return Element;
    }


    // test
    indexRender(){
        let text = getText()
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(text,"text/html");
        doc = xmlDoc;
        let childNodes = xmlDoc.documentElement.childNodes[1];
        // let ReacteEement = <div>{ReactHtmlParser(text)}</div>

        let parsed = this.htmlTraversal(childNodes);

        this.setState({
            parsed:parsed
        })
    }



    render(){
        if(this.state.parsed.length == 0){
            myConsole.log('解析 html')
            this.indexRender()
        }

        return(
            <div>
                <ReadPanel
                    content={this.state.parsed}
                />
                <ExplainPanel test={this.state.test} position={this.state.test.p}/>
                <TranslatePanel translateTarget={this.state.translateTarget} />
            </div>
        )
    }
}

export default App;
