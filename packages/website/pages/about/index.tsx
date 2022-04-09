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
                <li>不建议在deep reading打开的其他页面中登录你的个人账号</li>
            </div>
            <div>
                <h2>关于Deep Reading项目</h2>
                    Deep Reading是一个学习英语、阅读英语的工具App，不是提供一份最准确的翻译，而是最高效的帮你扫清英语阅读的障碍。
                <br />
                <br />
                <a href="https://github.com/BaotLake/deep-reading" target="_blank">
                    Deep Reading
                </a>
                是我（
                <a href="https://github.com/BaotLake" target="_blank">
                    欢洋
                </a>
                ）从2020年开始开发的个人项目，我在其中投入了非常多的个人时间和精力，因为Ta真的给我个人的学习带来了不少的便利，并且我相信会有更多的人喜欢Ta。
                <br />
                <br />
                只是个人的能量总是有限的，Deep Reading在以一种缓慢但顽强的方式成长着；
                如果你喜欢Ta，你可以这样支持Ta：
                
                <li>转发Deep Reading</li>
                <li>
                    <a href="https://github.com/BaotLake/deep-reading" target="_blank">
                        点亮github star
                    </a>
                </li>
                <li>
                    <span>关注公众号</span>
                    <div className={style['qrcode']}>
                        <img
                            src="/qrcode_for_weixin.jpg"
                        />
                        <div>偶尔分享一些优质内容或新功能介绍，不会经常打扰</div>
                    </div>
                </li>
            </div>
        </div>
    )
}
