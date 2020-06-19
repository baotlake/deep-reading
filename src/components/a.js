import React from 'react';
import '../App.css';

function A(props){

    const handleClick = (e)=>{
        console.log('A handleClick', e.currentTarget,e.currentTarget.attributes["data-src"]);
        // 阻止默认事件
        // e.preventDefault();

        try{
            // this.props.handleClick("链接","是否转跳")
            props.clickLink(e.currentTarget.attributes["data-src"].value, true);
        }catch(e){
            console.error('a.js need props.handleClick function!', e);
        }
    }
    
    // let aProps = props.props
    // // aProps.className = "wrp-a " + aProps.className;
    // aProps['data-href'] = aProps.href;
    // delete aProps.href;
    return (
        <a {...props.props}
            onClick={handleClick}
        >{props.children}</a>
    );
}

export default A;

// 有的页面会js动态加载新的<a/>, 该怎么办？
