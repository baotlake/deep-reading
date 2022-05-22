

export function apiUrl(type: string, params: Record<string, string>) {
    const spaceId = process.env.CONTENTFUL_SPACE_ID
    const envId = process.env.CONTENTFUL_ENV_ID
    const token = process.env.CONTENTFUL_CDA_TOKEN

    const q = new URLSearchParams({
        access_token: '' + token,
        ...params,
    }).toString()

    return `https://cdn.contentful.com/spaces/${spaceId}/environments/${envId}/${type}?` + q
}

export function contentfulExplore(data: any) {
    const assetUrlMap = data.includes.Asset.reduce(
        (a: any, c: any) => ({ ...a, [c.sys.id]: c.fields }),
        {}
    )
    // console.log('assetUrlMap', assetUrlMap)
    const items: [] = data.items
    const list = items.map((i: any) => ({
        url: i.fields.url,
        title: i.fields.title,
        des: i.fields.des,
        icon: assetUrlMap[i.fields?.favicon?.sys?.id]?.file?.url || i.fields.faviconUrl,
        tags: i.fields.tags,
    }))

    return list
}