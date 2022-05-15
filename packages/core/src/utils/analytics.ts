import { getSetting, setSetting } from "./setting"

const CID_KEY = 'ga-cid'

const initData = {
    v: 1,
    // tid: '309427566',
    tid: 'UA-183787896-1',
    cid: '',
    t: 'pageview',
}

async function getRequiredData() {
    if (initData.cid !== '') return { ...initData }

    let a = await getSetting<Record<string, string>>(CID_KEY)
    let cid = a?.cid || ''

    if (!cid) {
        cid = Math.round(Math.random() * 1e10) + ''
        setSetting({ key: CID_KEY, cid: cid })
    }
    initData.cid = cid

    return { ...initData }
}

type Parameters = Record<string, string | number | boolean>

export async function collect(parameters?: Parameters) {
    const required = await getRequiredData()
    const p = Object.fromEntries(Object.entries({ ...required, ...parameters }).map(
        ([key, value]) => typeof value === 'boolean' ? [key, value ? '1' : '0'] : [key, value + ''])
    )
    const q = new URLSearchParams(p)
    const url = 'https://www.google-analytics.com/collect' + '?' + q

    console.log('collect')

    return fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

type EventData = {
    ec: string
    ea: string
    el?: string
    ev?: number
} & Parameters

export function eventCollect(data: EventData) {
    console.log('eventCollect')
    return collect({ ...data, t: 'event' })
}

type TimingEventData = {
    utv: string /** variable name */
    utt: number /** timing time */
    utc?: string
    utl?: string
}
export function timingEventCollect(data: TimingEventData) {
    return collect({ ...data, t: 'timing' })
}
