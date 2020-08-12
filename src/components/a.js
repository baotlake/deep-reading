import React from 'react';
import '../App.css';

import { connect } from 'react-redux'
import * as aActions from '../actions/a'
import * as _ from 'lodash'


function A(props){

    const handleClick = (e)=>{
        // console.log('A handleClick', e.currentTarget,e.currentTarget.attributes["data-src"]);
        // // 阻止默认事件
        e.preventDefault();
        let url = _.get(e, 'currentTarget.attributes.data-src.value');
        if ( !url ) return;
        props.setSrc(url)
        props.setShow(true)
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

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch) => ({
    setShow: isShow => {
        dispatch(aActions.setShow(isShow))
    },
    setSrc: url => {
        dispatch(aActions.setSrc(url))
    }
})

export default connect(mapStateToProps,mapDispatchToProps)(A);

// 有的页面会js动态加载新的<a/>, 该怎么办？
