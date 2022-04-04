<div style="margin:auto;">
    <p
        style="display:flex;justify-content:center;"
    >
        <a href="https://wrp.netlify.app/wrp-read?url=https://www.typescriptlang.org/" style="margin-right: 10px;">
            <img width="300px" src="https://public-s.oss-cn-shanghai.aliyuncs.com/wrp_demo_2.gif" />
        </a>
        <a href="https://wrp.netlify.app/wrp-read?url=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2F">
            <img width="300px" src="https://public-s.oss-cn-shanghai.aliyuncs.com/wrp_demo.gif" />
        </a>
    </p>
    <p style="text-align:center;">手机上无障碍阅读英文</p>
</div>

## PWA APP

[Deep Reading —— 无障碍阅读英文](https://wrp.vercel.app/explore)

## 浏览器插件

### 浏览器插件有更好的体验
网页版由于种种技术限制，会出现打不开网页，网页不能正常交互等问题，浏览器插件则没有这些技术限制

### 在手机平板上使用浏览器插件
Android设备上可以在Kiwi Browser和Firefox Nightly中安装deep reading插件。

Safari在IOS设备中也已经支持了插件。deep reading对Safari的支持尚在规划中。

### 插件构建打包命令

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

输出目录: `packages/extension/dist/`

<!-- ## License -->
