//

function favicon() {
    let iconLink: HTMLLinkElement | null = document.querySelector('link[rel~="icon"]')
    if (iconLink) return iconLink.href

    return ''
}

function title() {
    let title = document.querySelector('title')?.textContent
    let header = document.querySelector('h1')?.textContent

    if (title && header) {
        return title + ' | ' + header
    }

    if (title && !header) {
        return title
    }

    if (!title && header) {
        return header
    }

    if (!title && !header) {
        let header2 = document.querySelector('h2')?.textContent
        if (header2) return header2

        let base = document.querySelector('base')
        if (base) {
            return new URL(base.href).hostname
        }
    }
    return 'NO TITLE'
}

function description() {
    let text = ''
    let pList = document.querySelectorAll('p')

    for (let i = 0; i < pList.length; i++) {
        text += pList[i].textContent + '\n'
        if (text.length > 500) break
    }

    if (text.length > 50) return text.trim()

    let bodyText = document.querySelector('body')?.textContent?.slice(0, 200) || ''
    return bodyText.trim()
}

export function abstract() {
    return {
        icon: favicon(),
        title: title(),
        description: description(),
    }
}
