/// <reference path="../../../module.d.ts" />

import { useReducer, useRef } from 'react'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import { initialState, reducer } from '../reducer'
import { ViewContext } from '../ViewContext'
import { Control } from '../Control'
import { Share } from '../Share'
import { useInitialize, useLoad, useMessage, useSetup } from '../hooks'
import type { LoadRefData, MessageRefData } from '../hooks'

import { ViewWrapper, IframeWrapper, Ifrmae } from './index.style'

type Props = {
    active?: boolean
}

export default function View({ active }: Props) {
    const iframeEl = useRef<HTMLIFrameElement>(null)
    const router = useRouter()
    const [state, dispatch] = useReducer(reducer, initialState)

    useInitialize(dispatch)

    const ref = useRef<LoadRefData & MessageRefData>({
        url: 'null',
        pendingUrl: '',
        pendingOptions: null,
        pendingId: 0,
        result: null,
        options: state.options,
        active: !!active,
        initialized: state.initialized,
        mount: false,
        router,
    })

    ref.current.options = state.options
    ref.current.active = !!active
    ref.current.initialized = state.initialized

    useLoad(ref, dispatch)
    useMessage(ref, dispatch)
    useSetup(dispatch)

    if (active !== false && iframeEl.current) {
        iframeEl.current.contentWindow?.postMessage(
            {
                type: 'restoreScroll',
            },
            '*'
        )
    }

    return (
        <ViewWrapper>
            <IframeWrapper>
                <Ifrmae
                    title="Deep Reading Content View"
                    key={state.frameKey}
                    src={state.frameSrc}
                    ref={iframeEl}
                    referrerPolicy="no-referrer"
                    sandbox={classNames(
                        'allow-scripts allow-forms allow-popups',
                        {
                            'allow-same-origin': state.allowSameOrigin,
                        }
                    )}
                />
                <ViewContext.Provider
                    value={{ state: state, dispatch: dispatch }}
                >
                    <Control />
                    {/* <Share /> */}
                </ViewContext.Provider>
            </IframeWrapper>
        </ViewWrapper>
    )
}
