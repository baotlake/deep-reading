// 

export default function noScript(htmlString: string): string {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlString, 'text/html')

    removeScript(doc)


    const srializer = new XMLSerializer()
    return srializer.serializeToString(doc)
}

function removeScript(doc: Document) {
    let scripts = doc.querySelectorAll('script')
    scripts.forEach((script) => {
        script && script?.parentElement && script.parentElement.removeChild(script)
    })
}

// function removeScriptLink(doc: Document) {
//     let scriptLinks = doc.querySelectorAll('link[rel=]')
// }