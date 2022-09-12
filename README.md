<div style="margin:auto;">
    <p
        style="display:flex;justify-content:center;"
    >
        <a href="https://wrp.netlify.app/reading?url=https://www.typescriptlang.org/" style="margin-right: 10px;">
            <img width="300px" src="https://public-s.oss-cn-shanghai.aliyuncs.com/wrp_demo_2.gif" />
        </a>
        <a href="https://wrp.netlify.app/reading?url=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2F">
            <img width="300px" src="https://public-s.oss-cn-shanghai.aliyuncs.com/wrp_demo.gif" />
        </a>
    </p>
    <p style="text-align:center;">青轻阅读 -- 秒查词，秒翻译</p>
</div>

# PWA APP

[Deep Reading —— 青轻阅读](https://wrp.netlify.app/explore) 是一个学习英语、阅读英语的APP。你可以手机上、平板上或者电脑上使用[青轻阅读](https://wrp.netlify.app/explore)浏览英语新闻、学习英语、阅读英语文档或是阅读英语百科词条。

青轻阅读不是为了提供一份最准确的翻译，而是去尝试扫清英语原文阅读中的障碍，*秒查词、秒翻译* 最便捷的查词和翻译，最小化原文阅读中的痛点。

不同于其他的一些英语阅读APP，青轻阅读是开放性的生态，海量的web内容都有可能可以在青轻阅读中阅读学习。

青轻阅读的其他站点 [wrp.vercel.app](https://wrp.vercel.app/explore) 、[deep....ondigitalocean.app](https://deep-reading-lpmhj.ondigitalocean.app/explore) 、[deep-reading.pages.dev](https://deep-reading.pages.dev/explore)

支持阅读模式（有大篇文字内容的页面）、启用/禁用JS以及启动/禁用Cookie等。

为了更加专注于阅读，网页端默认禁用了JS，第三方页面可能菜单不能正常点击。另外由于一些无法跨越的技术限制，部分第三方页面无法正常打开。如需避免这些问题，可使用扩展插件。Web APP有更好的兼容性，扩展插件则提供了更好的用户体验。

# 浏览器扩展插件

[Chrome 应用商店 - 青轻查词翻译](https://chrome.google.com/webstore/detail/deep-reading/oogkampbpcmckmfndhmehipcildkjfok)

[Edge 外接程序 - 青轻查词翻译](https://microsoftedge.microsoft.com/addons/detail/deep-reading/acnfkkjcdomnfjdgkmcgilhnnopjbngk)

[Firefox 火狐插件 - 青轻查词翻译](https://addons.mozilla.org/zh-CN/firefox/addon/%E9%9D%92%E8%BD%BB%E6%9F%A5%E8%AF%8D%E7%BF%BB%E8%AF%91/)

## 在手机平板上使用青轻阅读插件
Android设备上可以在Kiwi Browser和Firefox Nightly中安装deep reading插件。

### Android Firefox Nightly 插件安装步骤
1. 添加自定义附加组件收藏集，用户ID：`17012247`, 收藏集名称：`mobile-addons`
2. 搜索或打开链接 [青轻查词翻译](https://addons.mozilla.org/zh-CN/firefox/addon/%E9%9D%92%E8%BD%BB%E6%9F%A5%E8%AF%8D%E7%BF%BB%E8%AF%91/) 安装插件

Safari在IOS设备中也已经支持了插件。deep reading对Safari的支持尚在规划当中。

# Dev / Build


## Extension
output dir: `packages/extension/dist/`

在 windows 系统上 build
```shell
yarn build:windows
```
chrome v3
```shell
yarn build:extension
cd packages/extension
yarn zip
```

firefox
```shell
yarn build:extension
cd packages/extension
yarn build:firefox
yarn zip:firefox
```

## Dev
`tasks/start.py` 自动在 `Windows Terminal` 和 `Mac Terminal` 中打开多个tab运行各个子包的开发命令。

