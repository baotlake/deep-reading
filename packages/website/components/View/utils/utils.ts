
export function isSomeHost(link: string, link2: string) {
    try {
        const url = new URL(link)
        const url2 = new URL(link2)
        return url.host == url2.host
    } catch (error) { }
    return link == link2
}
