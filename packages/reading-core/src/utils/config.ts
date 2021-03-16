export const proxyHostList = [
    "www.wikipedia.org",
    "www.wikibooks.org",
    "wikibooks.org",
    "m.wikipedia.org",
    "en.wikipedia.org",
    "en.m.wikipedia.org",
    "twitter.com",
    "t.co",
    "news.google.com",
    "developer.chrome.com",
    "www.bbc.com",
    "bbc.com",
    "blog.diigo.com",
    "diigo.com",
    "www.kali.org",
    "gutenberg.net.au",
    "golang.org",
    "developer.android.com",
    "www.bbc.co.uk",
    // "reactjs.org",
]

export const lookupUrl = (text: string) => {
    // https://1773134661611650.cn-beijing.fc.aliyuncs.com/2016-08-15/proxy/WordingReadingPro/iciba/?key=zysj&q=
    return `https://1773134661611650.cn-shanghai.fc.aliyuncs.com/2016-08-15/proxy/wrp/wrp_server/iciba?w=${
        text.toLowerCase()
    }`
}

