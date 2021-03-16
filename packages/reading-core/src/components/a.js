import React from 'react'
import {
    Link,
} from 'react-router-dom'

import { connect } from 'react-redux'
import * as aActions from '../actions/a'
import * as _ from 'lodash'

// A 组件目前弃用
function A(props) {

    const handleClick = (e) => {
        e.preventDefault();
        let url = _.get(e, 'currentTarget.attributes.data-src.value');
        if (!url) return;
        props.setHref(url)
        props.setShow(true)
    }

    let aProps = props.props
    aProps.className = "wrp-a " + aProps.className;
    aProps['data-href'] = aProps.href;
    delete aProps.href;

    return (
        <a {...aProps}
            onClick={handleClick}
        >{props.children}</a>
    );
}

const mapDispatchToProps = (dispatch) => ({
    setShow: isShow => {
        dispatch(aActions.setShow(isShow))
    },
    setHref: href => {
        dispatch(aActions.setHref(href))
    }
})

export default connect(null, mapDispatchToProps)(A);

// extension 中a不可以用“/wrp-read?url=...”方式打开新页面
// 怎么兼容 extension 比较好呢 ?

// 另外如何区分 extension 和 网页的环境呢，是运行时区分，还是build时区分
