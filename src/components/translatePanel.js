import React from 'react';
import Word from './word.js';
import { isS } from 'xmlchars/xml/1.0/ed5';

// 放到TranslatePanel 哪里合适
var translateScope={
    front:1,    //设定值
    behind:1,   //设定值
    nf:0,       //当前值
    nb:0        //当前值
}

class TranslatePanel extends React.Component{
    constructor(props){
        super(props)
        this.state={
        }
        
    }

    extractSentence(target){
        console.log("extract sentence")
        // 由target提取所在句子。target为event.target
        let parent = target.parentNode


    }

    // app.js
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

    // app.js
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

    

    isTranslateEnd(symbol,direction){
        console.log('translate end', symbol,direction)
        // 裁定滑动翻译的范围，比如翻译1句，还是3句
        if(this.isSentenceEnd(symbol)){
            if(direction == "front"){
                translateScope.nf += 1
                if(translateScope.nf = translateScope.front){
                    console.log('translate end', true)
                    return true
                }
            }else if(direction == "behind"){
                translateScope.nb += 1
                if(translateScope.nb = translateScope.behind){
                    console.log('translate end', true)
                    return true
                }
            }
        }
        console.log('translate end', false)
        return false
    }

    copy(content,children){
        // Element、Children 为React Element
        let type = content.nodeName.toLowerCase().replace('body','div')
        let props = this.attToProps(content)
        let element = React.createElement(type,props,...children)
        return element
    }

    copyWord(word){
        // copy Word, 由Word渲染后的span便签copy Word
        return(
            <Word
                content={word.textContent}
                handleClick={()=>{}}
                translate={()=>{}}
            />
        )
    }

    isSentenceEnd(symbol){
        const end = /[.。!！?？]/
        return !!symbol.match(end)
    }

    frontFind(target){
        // 向前遍历同级兄弟节点
        let list = [];
        while(target){
            console.log("front, while", target);
            if(target.nodeName == "#text"){
                if(this.isTranslateEnd(target.textContent,'front')) break;
                list.unshift(target.textContent);
            }else if(target.nodeName == "SPAN"){
                if(target.classList[0] == "@w"){
                    // Word
                    list.unshift(this.copyWord(target));
                }else{
                    // 需要遍历子节点
                    let children = this.frontFind(target.lastChild);
                    list.unshift(this.copy(target,children));
                }
            }else{
                // 其他标签， 遍历子节点
                let children = this.frontFind(target.lastChild);
                console.log("front children", children)
                list.unshift(this.copy(target,children));
            }

            target = target.previousSibling            
        }
        return list
    }

    behindFind(target){
        // 向后遍历同级兄弟节点
        if(target) target = target.nextSibling      // behind 与 front 有一个重合, behind后推一个
        let list = [];
        while(target){
            console.log("next, while", target);
            if(target.nodeName == "#text"){
                list.push(target.textContent);
                if(this.isTranslateEnd(target.textContent,'behind')) break;
            }else if(target.nodeName == "SPAN"){
                if(target.classList[0] == "@w"){
                    // Word
                    list.push(this.copyWord(target));
                }else{
                    // 需要遍历子节点
                    let children = this.behindFind(target.firstChild);
                    list.push(this.copy(target,children));
                }
            }else{
                // 其他标签， 遍历子节点
                let children = this.behindFind(target.firstChild);
                list.push(this.copy(target,children));
            }

            target = target.nextSibling;
        }
        return list
    }

    test(target){
        console.log('translate test',target)
        let front = this.frontFind(target)
        let behind  = this.behindFind(target)
        console.log('front, behind', front, behind)
        if(target) console.log('next ', target.nextSibling)
        return [front, behind]
    }

    render(){

        let [front,behind] = this.test(this.props.translateTarget)
        
        let style={
            "width": "35em",
            "height": "10em",
            "backgroundColor": "#dfd",
            "borderRadius": "15px",
            "position": "fixed",
            "bottom": "0"
        }

        return (
            <div style={style}>
                {front}
                <span> | </span>
                {behind}
            </div>
        )
    }
}

export default TranslatePanel;