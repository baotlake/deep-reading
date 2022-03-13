// import Image from 'next/image'
import style from './index.module.scss'

export default function About() {
    return (
        <div className={style['about-page']}>
            <div>
                <h2>用法</h2>
                <div className={style['image']}>
                    <img
                        placeholder="empty"
                        src="/wrp_demo.gif"
                    />
                </div>
                <p>

                </p>
            </div>
            <div>
                <h2>安全提示</h2>
                <li>不建议在deep reading中打开的页面中登录你的个人账号</li>
            </div>
            <div>
                <h2>Deep Reading项目</h2>
                <a href="https://github.com/BaotLake/deep-reading" target={"_blank"}>
                    Deep Reading
                </a>
                由
                <a href="https://github.com/BaotLake" target="_blank">
                    欢洋
                </a>
                个人业余时间开发维护
                <br />
                你可以通过下列方式支持我
                <li>
                    <a href="https://github.com/BaotLake/deep-reading" target="_blank">
                        点亮github star
                    </a>
                </li>
                <li>
                    <span>关注微信公众号</span>
                    <div className={style['qrcode']}>
                        <img
                            src="/qrcode_for_weixin.jpg"
                        />
                    </div>
                </li>
                <li>分享Deep Reading给需要的朋友</li>
            </div>

        </div>
    )
}
