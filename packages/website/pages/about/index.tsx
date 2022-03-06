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
                    // layout="fill"
                    // objectFit="contain"
                    />
                </div>
                <p>
                    deep reading以代理的方式打开第三方网页，部分第三方网出于各种考虑可能会拒绝这种连接方式，
                    因此部分页面打开可能无法进行某些交互（例如展开菜单、搜索等），这个问题在web平台没有好的解决方案（如果你有，欢迎你在github提出来）。
                    <br />
                    后续，deep reading会尝试开发Firefox Android扩展插件，以及Android和IOS客户端，以期解除web端的技术限制，做到更好的用户体验。
                </p>
            </div>
            <div>
                <h2>安全提示</h2>
                <li>不建议在deep reading中打开的其他页面中登录你的个人账号</li>
            </div>
            <div>
                <h2>Deep Reading项目</h2>
                <a href="https://github.com/BaotLake/word-reading-pro" target={"_blank"}>
                    Deep Reading
                </a>
                由
                <a href="https://github.com/BaotLake" target="_blank">
                    欢洋
                </a>
                个人业余时间开发维护。
                <br />
                如果你觉得deep reading对你学习有所帮助，你可以通过下列方式支持我
                <li>star deep reading</li>
                <li>
                    <span>关注deep reading微信公众号</span>
                    <div className={style['qrcode']}>
                        <img
                            src="/qrcode_for_weixin.jpg"
                            // layout="fill"
                            // objectFit="contain"
                        />
                    </div>
                </li>
                <li>分享Deep Reading给其他人</li>
            </div>

        </div>
    )
}
