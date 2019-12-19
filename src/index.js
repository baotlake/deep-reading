import React from 'react';
import ReactDOM from 'react-dom';

import ReactDOMServer from 'react-dom/server';
import ReactHtmlParser from 'react-html-parser';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import getText from './text.js';
import Word from './components/word.js';

class Test extends React.Component{
    constructor(){
        super();
        this.state={

        }
    }

    isInnerText(content){
        const innerText = ['#text','B','I','EM','S','SMALL','U','STRONG','MARK','SPAN']
        if(innerText.includes(content.nodeName)){
            return true;
        }else{
            return false;
        }
    }

    hasCrossWord(node,node2){
        let nodeLastChar;
        let node2FirstChar;
        if(node && node2){
            if(node2){
                // console.log('---------')
                // console.log(node2, node2.textContent, typeof(node2.textContent),node2.textContent)
                if(! this.isInnerText(node) || !this.isInnerText(node2)){
                    return false;
                }
                node2FirstChar = node2.textContent[0];
            }else{
                return false;
            }
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

    textSplit(text){
        /**just #text ; 仅文本,不含其他标签 */
        let re = /\b/;
        let wordpattern = /\w+/
        let List = [];
        // console.log('---->', typeof(text))
        let splitList = text.split(re)
        for(let w of splitList){
            if(wordpattern.test(w)){
                List.push(
                <Word
                    content = {w}
                />
                )
            }else{
                List.push(w)
            }
        }

        return List
    }

    styleFormat(cssText){
        console.log("cssText",cssText)
        if(cssText != ""){
            cssText = cssText.replace(/:\s*/g, '":"')
            cssText = cssText.replace(/;\s*/g, '","')
            cssText = '{"' + cssText + '"}'
            cssText = cssText.replace(/,""/g, '')
            // 还需要对一些内容进行替换，比如 border-radius 替换为borderRadius

            let style = JSON.parse(cssText)
            console.log("cssText",cssText,typeof(cssText))
            console.log('style ->', style)

            return style
        }
        return {}
    }

    attToProps(content){
        let props = {};
        console.log("attToProps", content)
        let cssText = content.style.cssText
        props['style'] = this.styleFormat(cssText);

        console.log('style-->',cssText)
        let classList = content.classList
        if(content.href) props['href'] = content.href
        if(content.hidden != null) props['hidden'] = content.hidden

        return props
    }

    tagTraversal(content){
        /*先判断content是否包含子标签 */
        let Element       // react Element
        let Children = []       // react Element Children

        let testList = [];

        // console.log('type ->', typeof(content));
        if(typeof(content.innerHTML) == 'string'){

            //console.log('innerHTML')
            /*文字标签混合，情况复杂 */
            // console.log('nodeName->', content.nodeName)
            let hasCrossWord = 0;
            /** has cross word 是否存在‘交叉情况’ 
             * 所谓的交叉是指一个单词被分分隔在两个兄弟标签中
             * 如: <b>dev<b/><i>eloper<i/> 
             */
            let CrossWord;
            let CrossWordParent;
            let childNodes = content.childNodes;
            for(let i in childNodes){
                console.log("-=-=- childNodes",childNodes[i].innerHTML," i:", i, 'hasCrossWord:',hasCrossWord,"i type:", typeof(childNodes))
                console.log("nodeName ", childNodes[i].nodeName, typeof(childNodes[i]))
                console.log("textContent", childNodes[i].textContent, typeof(childNodes[i].textContent))
                try{
                    console.log("next", childNodes[i + 1].innerHTML)    
                }catch{

                }


                if(childNodes[i].textContent == undefined){
                    continue
                }
                if(i - hasCrossWord == 1){
                    /**获取暂存的交叉值前半部分，提取后半部分 -> 组装 （首部组装） */
                    if(childNodes[i].nodeName == '#text' && childNodes[i].textContent != ''){
                        console.log('【?】',childNodes[i-1],childNodes[i], childNodes[i].textContent, typeof(childNodes[i]))
                        console.log('textContent', childNodes[i].textContent,childNodes[i].textContent.length)
                        CrossWordParent = childNodes[i].parentNode;
                        //let secondHalf = childNodes[i].textContent.match(/^\w+/)[0]
                        // console.log(secondHalf)
                        childNodes[i].textContent = childNodes[i].textContent.replace(/^\w+/, '');
                        // console.log(childNodes[i])
                    }else{
                        // console.log('???', childNodes[i].textContent)

                    }
                }
                if(this.hasCrossWord(childNodes[i],childNodes[i + 1])){
                    // 仅文本尾部存在交叉情况crossword
                    hasCrossWord = i;
                    // console.log('set hasCrossWord',childNodes[i],childNodes[i + 1],'----set end---' )

                    if(i - hasCrossWord == 1){
                        /**首尾都存在交叉情况 */
                        if(/\w+/.test(childNodes[i].textContent)){
                            // 三交叉情况 -> 暂存

                        }
                        // push 首部组装

                    }
                    /**提取后半部分
                     * 如果有内容 -> 暂存
                    */

                }
                /**不存在交叉情况 */

                if(childNodes[i].nodeName == '#text'){
                    // 对纯文本内容进行替换
                    let word = this.textSplit(childNodes[i].textContent)
                    Children.push(word)
                    // console.log('word', word)
                }else{
                    console.log('else -> "',childNodes[i].innerHTML,'"「', typeof(childNodes[i]),"」")
                    // console.log('if', typeof(childNodes[i]) == 'object')

                    if(typeof(childNodes[i]) == 'object'){
                        console.log('test nodeName 「', childNodes[i].nodeName, '」')
                        // childNodes[i].innerHTML = this.tagTraversal(childNodes[i])       // innerHTML
                        Children.push(this.tagTraversal(childNodes[i]))                     // React Element

                    }else{
                        console.log('what? ->', childNodes[i].innerHTML)
                        // break ???
                        break
                    }

                    // testList.push(this.tagTraversal(childNodes[i]))
                    // this.tagTraversal(childNodes[i])
                }

                // test
                try{
                    // console.log('--------------\n', childNodes[i])
                    // // ReactDOM.hydrate(<Word/>,childNodes[i])
                    // ReactDOM.render(<Word/>,childNodes[i])
                    // console.log(childNodes[i])
                }catch{

                }

            }
            // content.childNodes = childNodes;
            // console.log('here childNodes ->', childNodes)
        }else{
            console.log('text', content.textContent)
            /*可以直接由空格分词 */
            let word = this.textSplit(content.textContent)
            Children.concat(word)
        }

        // 莫名出现body标签，对其进行替换
        let type = content.nodeName.toLowerCase().replace('body','div')

        let props = this.attToProps(content)

        Element = React.createElement(type,props,Children)


        console.log('Element ->', Element)

        // return content.innerHTML;
        return Element;
    }

    render(){
        let text = getText()
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(text,"text/html");
        let x = xmlDoc.documentElement.childNodes;
        // let ReacteEement = <div>{ReactHtmlParser(text)}</div>

        let parsed = []

        for(let i of x){
            console.log("for +1")
            console.log('parsed ->',parsed)
            if(i.hasChildNodes()){
                let a = this.tagTraversal(i)
                console.log('temp a ->',a)
                parsed = parsed.concat(a);
            }else{
            }
        }
    

        console.log('result ->', parsed)

        return(
            <div
                style={{"width":"500px","height":"500px","backgroundColor":"#eee"}}
            >
                <span onClick={()=>{alert('click')}}>here</span>
                <Word content="try Click"></Word>
                <div >{parsed}</div>
            </div>
        )
    }
}


ReactDOM.render(<Test />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
