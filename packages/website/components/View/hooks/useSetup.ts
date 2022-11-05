import { useEffect, Dispatch } from 'react'
import { setFrameKey, Action } from '../reducer'

export function useSetup(dispatch: Dispatch<Action>) {
    useEffect(() => {
        const handleSPV = (e: SecurityPolicyViolationEvent) => {
            if (
                e.disposition === 'enforce' &&
                e.effectiveDirective === 'frame-src'
            ) {
                dispatch(setFrameKey(Date.now()))
            }
        }
        window.addEventListener('securitypolicyviolation', handleSPV)
        return () => {
            window.addEventListener('securitypolicyviolation', handleSPV)
        }
    }, [])
}