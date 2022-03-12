//

function recapIcon(doc = document) {
    const appleTouchIcon = doc.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]')
    if (appleTouchIcon) return appleTouchIcon?.href

    let iconLink = doc.querySelector<HTMLLinkElement>('link[rel~="icon"]')
    if (iconLink) return iconLink?.href

    return ''
}

export function recapTitle(doc = document) {
    const title = doc.querySelector('title')?.textContent
    if (title) return title

    const ogTitle = doc.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.content
    if (ogTitle) return ogTitle

    const header = doc.querySelector('h1,h2,h3,h4,h5')?.textContent
    if (header) return header

    return doc?.location?.hostname
}

export function recapDescription(doc = document) {
    const des = doc.querySelector<HTMLMetaElement>('meta[name="description"]')?.content
    if (des) return des

    const ogDes = doc.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.content
    if (ogDes) return ogDes

    const twitterDes = doc.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')?.content
    if (twitterDes) return twitterDes

    let bestScore = -1
    let bestIndex = -1

    const scoring = (p: Element, i: number) => {
        let score = 0
        // order
        score = score + Math.max(5 - i, 0) * 3
        // className
        if (/des/.test(p.className)) score = score + 10
        // text length
        const length = p.textContent?.length || 0
        score = score + Math.max(5 - Math.abs(length - 250) / 50, 0) * 2.1
        // children length
        const childLength = p.childNodes.length
        score = score + Math.max(3 - childLength, 0) * 2.5

        if (score > bestScore) {
            bestScore = score
            bestIndex = i
        }
    }

    const pList = Array.from(doc.querySelectorAll('p')).slice(0, 15)
    pList.forEach(scoring)

    if (bestIndex > -1) return pList[bestIndex]?.textContent

    bestScore = -1
    bestIndex = -1
    const elList = Array.from(doc.querySelectorAll('li,span,section,ul,ol,dl'))
    elList.forEach(scoring)

    if (bestIndex > -1) return elList[bestIndex]?.textContent
}

export function abstract() {
    return {
        icon: recapIcon(),
        title: recapTitle(),
        description: recapDescription(),
    }
}
