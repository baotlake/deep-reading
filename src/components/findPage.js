import React from 'react';

import './findPage.css';
import { withRouter } from 'react-router';

import {ItemCard} from '../home.js';


function itemCard(){

    return (
        <div className="wrp-card-wrapper wrp-cp" onClick={()=>{}}>
            <div className="wrp-image-wrapper wrp-card-image">
                {/*<img className="wrp-image" src="https://lh6.googleusercontent.com/proxy/GICqS-kiP8lyGI9A7Qq-JJvzZl5HTfMjebIFUmD3k8rE4hMW2f7fBPpusTyl2KYNEF47lNVtuF5YFvfiXWTHqRghBA"></img>*/}
                <svg className="wrp-image " height="32" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
            </div>
            <div className="wrp-card-text-wrapper">
                <div className="wrp-ellipsis wrp-ct">GitHub-Built for developers</div>
                <div className="wrp-cs">GitHub is a development platform inspired by the way you work. From open source to business, you can host and review code, manage projects, and build software alongside 40 million developers.</div>
            </div>
        </div>
    )
}

function itemIcon(){

    return (
        <div className="wrp-nav-item wrp-item-icon" onClick={()=>{}}>
            <svg className="wrp-nav-item-icon " height="32" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
            <div className="wrp-nav-item-title wrp-ellipsis" >GitHub-Built for developers</div>
        </div>
    )
}

function FindPage(){


    return (
        <>
            <div className="wrp-card-container">
                <ItemCard data={{src:'',title:'a',des:'b'}} ></ItemCard>
                {itemCard()}
                {itemCard()}
                {itemCard()}
                {itemCard()}
                {itemCard()}
                {itemCard()}
                {itemCard()}
                {itemCard()}
                {itemCard()}
                {itemCard()}
                {itemCard()}
                {itemCard()}
                {itemCard()}
                {itemCard()}
                {itemCard()}
                {itemCard()}
            </div>
            <div className="wrp-card-container">
                {itemIcon()}
                {itemIcon()}
                {itemIcon()}
                {itemIcon()}
                {itemIcon()}
                {itemIcon()}
                {itemIcon()}
                {itemIcon()}
                {itemIcon()}
                {itemIcon()}
                {itemIcon()}
                {itemIcon()}
            </div>
        </>
    )
}

// export {FindPage};
// let withRouterFindPage = withRouter(FindPage);
// export {FindPage};
export default withRouter(FindPage);