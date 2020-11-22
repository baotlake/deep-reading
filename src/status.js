import React from "react";
import { connect } from 'react-redux';
import * as actions from './actions/app';

import './status.scss';


function Status(props){
    // props.status,
    console.log('Status', props.status)

    const handleClick = ()=>{
        // 回退，将状态重置为completed
        if(props.status == 'completed') return;
        if(props.status == 'loading') return;
        if(props.status == 'parsing') return;

        try{
            props.setStatus('completed')
        }catch(e){
            console.error('status.js: need props.setStatus() ', e);
        }

    }

    const wrapper = (content)=>{
        return (
            <div 
                className="wrp-show-status"
                onClick = {handleClick}
            >
                {content}
            </div>
        );
    }

    const errorIcon = (
        <div className="wrp-icon">
            <svg className="wrp-icon-svg" viewBox="0 0 1024 1024" version="1.1" width="200" height="200" fill="rgb(var(--t-c-e))"><defs><style type="text/css"></style></defs><path d="M512 0a512 512 0 0 0-512 512 512 512 0 0 0 512 512 512 512 0 0 0 512-512 512 512 0 0 0-512-512z m241.005714 703.268571a32.182857 32.182857 0 0 1 0.512 45.348572 32.182857 32.182857 0 0 1-45.348571 0.512L512 556.763429 315.830857 748.982857a31.963429 31.963429 0 1 1-44.836571-45.787428L466.285714 512l-195.291428-191.268571a32.182857 32.182857 0 0 1-0.512-45.348572 32.182857 32.182857 0 0 1 45.348571-0.512L512 467.236571 708.169143 275.017143a31.963429 31.963429 0 1 1 44.836571 45.787428L557.714286 512l195.291428 191.268571z" p-id="10064"></path></svg>
        </div>
    );

    const button = (
        <div>
            <button>重试</button>
            <button>返回</button>
        </div>
    );

    var statusContent = '';
    switch(props.status){
        case "loading":
        case "parsing":
        default:
            if(props.status == "loading" || props.status == "parsing"){
                statusContent = wrapper(
                    <>
                        <div className="wrp-icon">
                            <div className="wrp-loading-icon">
                                <div/> <div/>
                            </div>
                        </div>
                        <div className="wrp-status-tip">{props.status=="loading"?"加载中...":"解析中..."}</div>
                    </>
                )
            }
            break;
        case "failed":
        case "timeout":
            statusContent = wrapper(
                <>
                    {errorIcon}
                    <div className="wrp-text">{props.status=="failed"?"加载失败":"加载超时"}</div>
                    <div className="wrp-text wrp-status-des">
                        加载此网址：
                        <span className="wrp-warning">{props.url}</span>
                        <br/>发生问题，请检查网址!
                    </div>
                </>
            )
            break;
        case "typeError":
            statusContent = wrapper(
                <>
                    {errorIcon}
                    <div className="wrp-text">返回类型错误</div>
                    <div className="wrp-text wrp-status-des">
                        此网址：
                        <span className="wrp-warning">{props.url}</span>
                        <br/>返回不受支持的内容，请检查网址!
                    </div>
                </>
            )
            break;
        case "completed":
            statusContent = ''
            break;
    }

    return statusContent
            
}

const mapStateToProps = state => ({
    status: state.webApp.status
})

const mapDispatchToProps = dispatch => ({
    setStatus: status => {
        dispatch(actions.setStatus(status))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Status);