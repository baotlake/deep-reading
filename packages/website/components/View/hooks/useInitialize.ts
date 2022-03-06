import { Dispatch, useEffect } from "react"
import type { Action, State } from '../reducer'
import { initialize } from '../reducer'
import { getSetting } from '@wrp/core'
import Bowser from "bowser"

import { SETTING_SAME_ORIGIN, SETTING_SCRIPT } from '../utils/key'


export function useInitialize(dispatch: Dispatch<Action>) {
    useEffect(() => {

        const browser = Bowser.getParser(window.navigator.userAgent)
        const x5patch = browser.getBrowserName() === 'WeChat'

        const scriptPromise = getSetting<{ key: string, value: State['options']['script'] }>(SETTING_SCRIPT)
        const sameOriginPromise = getSetting<{ key: string, value: State['options']['sameOrigin'] }>(SETTING_SAME_ORIGIN)

        Promise.all([scriptPromise, sameOriginPromise]).then((values) => {
            const [scriptSetting, sameOriginSetting] = values

            dispatch(initialize({
                script: scriptSetting?.value || 'auto',
                sameOrigin: sameOriginSetting?.value || 'auto'
            }, x5patch))
        })

    }, [])
}