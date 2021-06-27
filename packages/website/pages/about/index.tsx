import Image from 'next/image'
import style from './index.module.scss'

export default function About() {
    return (
        <div className={style['about-page']}>
            <p>
                <h2>用法</h2>
                <div className={style['image']}>
                    <Image
                        placeholder="empty"
                        src="/wrp_demo.gif"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
            </p>
            <p>
                <a href="https://github.com/BaotLake/word-reading-pro">
                    该项目(GitHub)
                </a>
                是由
                <a href="https://github.com/BaotLake" target="_blank">
                    欢洋
                </a>
                个人开发维护。
            </p>
            <p>
                <span>欢迎关注该项目微信公众号</span>
                <div className={style['qrcode']}>
                    <Image
                        src="/qrcode_for_weixin.jpg"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
            </p>
        </div>
    )
}
