import { Dispatch, useEffect } from "react"
import { Action, initialState, State } from '../reducer'
import { initialize } from '../reducer'
import { getSetting, removeSetting } from '@wrp/core'

import {
    SETTING_AUTO_READER_MODE,
    SETTING_AUTO_ALLOW_SCRIPT,
    SETTING_AUTO_ALLOW_SAME_ORIGIN,
    
    SETTING_READER_MODE,
    SETTING_ALLOW_SCRIPT,
    SETTING_ALLOW_SAME_ORIGIN,

    SETTING_SAME_ORIGIN,
    SETTING_SCRIPT,
} from '../utils/key'

type BooleanSetting = { key: string, value: boolean }
type OpinionSetting = { key: string, value: State['options']['readerMode'] }

export function useInitialize(dispatch: Dispatch<Action>) {
    useEffect(() => {
        const autoReaderMode = getSetting<BooleanSetting>(SETTING_AUTO_READER_MODE)
        const autoAllowScript = getSetting<BooleanSetting>(SETTING_AUTO_ALLOW_SCRIPT)
        const autoAllowSameOrigin = getSetting<BooleanSetting>(SETTING_AUTO_ALLOW_SAME_ORIGIN)

        const readerMode = getSetting<OpinionSetting>(SETTING_READER_MODE)
        const allowScript = getSetting<OpinionSetting>(SETTING_ALLOW_SCRIPT)
        const allowSameOrigin = getSetting<OpinionSetting>(SETTING_ALLOW_SAME_ORIGIN)


        Promise.all([
            autoReaderMode,
            autoAllowScript,
            autoAllowSameOrigin,
            readerMode,
            allowScript,
            allowSameOrigin,
        ])
            .then((values) => {
                console.log('useInitialize settings: ', values)
                const [
                    autoReaderMode,
                    autoAllowScript,
                    autoAllowSameOrigin,
                    readerMode,
                    allowScript,
                    allowSameOrigin,
                ] = values

                dispatch(initialize({
                    autoReaderMode: autoReaderMode?.value ?? initialState.options.autoReaderMode,
                    autoAllowScript: autoAllowScript?.value ?? initialState.options.autoAllowScript,
                    autoAllowSameOrigin: autoAllowSameOrigin?.value ?? initialState.options.autoAllowSameOrigin,

                    readerMode: !autoReaderMode?.value && readerMode?.value ? readerMode.value : '',
                    allowScript: !autoAllowScript?.value && allowScript?.value ? allowScript.value : '',
                    allowSameOrigin: !autoAllowSameOrigin?.value && allowSameOrigin?.value ? allowSameOrigin.value : '',
                }))
            })
            .then(() => {
                removeSetting(SETTING_SCRIPT)
                removeSetting(SETTING_SAME_ORIGIN)
            })

    }, [])
}