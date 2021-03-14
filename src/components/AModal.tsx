import React from 'react'
import {
    Link,
} from 'react-router-dom'
import { connect, RootStateOrAny, ConnectedProps } from 'react-redux'
import * as _ from 'lodash'
/* eslint import/no-webpack-loader-syntax: off */
import styles from '!!raw-loader!sass-loader!./aModal.scss'

type Props = ConnectedProps<typeof connector>

function Modal(props: any) {

    const link = {
        hash: false,
        url: "",
    }

    return (
        <div
            className={'wrp-link-dialog-box '.concat(props.a.show ? 'link-dialog-show' : '')}
            data-wrp-action-block="intercept"
        >
            <style>{styles}</style>
            <div>
                {(/^#.+/.test(props.a.href)) ?
                    <a href={props.a.href}>
                        <div className="wrp-nav-item wrp-ld-button">
                            <svg className="wrp-nav-item-icon " viewBox="0 0 1024 1024" version="1.1" fill="var(--c-dark)" xmlns="http://www.w3.org/2000/svg" p-id="4385"><defs><style type="text/css"></style></defs><path d="M250.016 416.992l319.008 43.008 40 310.016 236-591.008zM120.992 464q-11.008-0.992-18.496-8.512t-8.992-19.008 4-20.512 15.488-12.992l778.016-311.008q8.992-4 18.016-2.016t16 8.992 8.992 16-2.016 18.016l-310.016 776q-4 10.016-13.504 15.488t-20.512 4-18.496-8.992-8.512-18.496l-48.992-384z" p-id="4386"></path></svg>
                            <div className="wrp-nav-item-title" >转跳至此处</div>
                        </div>
                    </a>
                    :
                    <Link
                        className="wrp-nav-item wrp-ld-button"
                        to={`/wrp-read?url=${encodeURIComponent(props.a.href)}`}
                    >
                        <svg className="wrp-nav-item-icon " viewBox="0 0 1024 1024" version="1.1" fill="var(--c-dark)"><path d="M863 942H500.3L309.7 822.6c-33.8-21.2-54.9-60.7-54.9-103V162.5c0-30.4 14.5-57.6 38.7-72.9 24.4-15.4 53.6-15.4 78-0.1L507 174.3h356c52.9 0 96 46.9 96 104.6v558.4c0 57.8-43.1 104.7-96 104.7z m-345.6-69.8H863c17.6 0 32-15.6 32-34.9V278.9c0-19.2-14.4-34.9-32-34.9H489.9l-150.3-94.1c-6.4-4-12-1.3-14.1 0-2.5 1.6-6.7 5.3-6.7 12.6v557.1c0 17.5 8.7 33.8 22.8 42.5l175.8 110.1z" fill="#595959" p-id="4277"></path><path d="M508.8 942H161c-52.9 0-96-46.9-96-104.6V278.9c0-57.7 43.1-104.6 96-104.6h125.8v69.8H161c-17.6 0-32 15.6-32 34.9v558.4c0 19.2 14.4 34.9 32 34.9h347.8V942zM497.5 174.3h1v69.8h-1z" p-id="4278"></path><path d="M480 209.2h64v697.2h-64z" p-id="4279"></path></svg>
                        <div className="wrp-nav-item-title">阅读新页面</div>
                    </Link>
                }
            </div>
            <a target="_blank" href={props.a.href}>
                <div className="wrp-nav-item wrp-ld-button">
                    <svg className="wrp-nav-item-icon " version="1.1" x="0px" y="0px" viewBox="0 0 200 200" ><path fill="var(--c-dark)" d="M168.8,123.3c0-3.2,2.8-5.8,6.3-5.8s6.3,2.6,6.3,5.8V164c0,6.4-5.6,11.6-12.5,11.6H31.2	c-6.9,0-12.5-5.2-12.5-11.6V36c0-6.4,5.6-11.6,12.5-11.6H75c3.5,0,6.3,2.6,6.3,5.8s-2.8,5.8-6.3,5.8H37.5c-3.4,0-6.2,2.6-6.3,5.8	c0,0,0,0,0,0.1v116.2c0,3.2,2.8,5.8,6.2,5.8c0,0,0,0,0.1,0h125c3.4,0,6.2-2.6,6.3-5.8c0,0,0,0,0-0.1V123.3z M74,132.8	c-2.4,2.3-6.4,2.3-8.8,0c0,0,0,0,0,0c-2.4-2.2-2.5-5.9-0.1-8.2c0,0,0,0,0,0l94-87.4l-34.4,0.1c-3.4,0-6.1-2.5-6.2-5.7	c0,0,0-0.1,0-0.1c0-3.2,2.8-5.8,6.2-5.8l49.8-0.2c3.4,0,6.1,2.5,6.2,5.7c0,0,0,0.1,0,0.1l-0.2,46.4c-0.1,3.2-2.8,5.8-6.3,5.8	c-3.4,0-6.2-2.5-6.2-5.6c0,0,0-0.1,0-0.1l0.1-32.6L74,132.8z" /></svg>
                    <div className="wrp-nav-item-title">新窗口打开</div>
                </div>
            </a>
        </div>
    )
}

const mapStateToProps = (state: RootStateOrAny) => ({
    a: state.a,
})

const connector = connect(mapStateToProps, null)

export default connector(Modal)