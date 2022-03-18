
import classNames from 'classnames'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import { SiteProfile } from './SiteProfile'
import { Options } from './Options'
import { ViewContext } from '../ViewContext'

import { styled } from '@mui/material'

const d = 0.3

const Wrapper = styled('div')({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: 0,
    pointerEvents: `none`,
    transition: `background ${d}s, height 0s ${d}s`,

    '&.loading': {
        background: `rgba(0, 0, 0, 0.2)`,
        height: '100vh',
        transition: `background ${d}s, height 0s`,
    },
    '&.plus':  {
        height: '100vh',
        background: `rgba(0, 0, 0, 0.3)`,
        backdropFilter: `blur(5px)`,
        transition: `background ${d}s, height 0s`,
    },
})

const Container = styled('div')({
    position: 'relative',
    height: '100vh',
    padding: 24,
    boxSizing: 'border-box',
    transform: `translate(0, -120%)`,
    transition: `all ${d}s`,

    '&.loading': {
        pointerEvents: `none`,
        transform: `translate(0, 0)`,

        '> *': {
            pointerEvent: 'all',
        }
    },

    '&.plus': {
        transform: `translate(0, 0)`,
        pointerEvents: 'all',
    },
})


const plusHashRegex = /#plus$/

export function Control() {

    const router = useRouter()

    const plus = router.asPath.match(plusHashRegex)

    const {
        state: {
            favicon,
            title,
            pendingUrl,
            url,
            loading,
            loaded,
        }
    } = useContext(ViewContext)

    const host = /^https?:\/\//.test(pendingUrl) ? new URL(pendingUrl).hostname : pendingUrl

    const handleClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLDivElement
        if (!target.classList.contains('control')) return

        plus && router.replace({
            pathname: router.pathname,
            query: router.query,
            hash: ''
        })
    }

    return (
        <Wrapper
            className={classNames({
                loading: loading || !loaded,
                plus: plus
            })}
        >
            <Container
                className={classNames('control', {
                    loading: loading || !loaded,
                    plus: plus
                })}
                onClick={handleClick}
            >
                <SiteProfile
                    loaded={loaded}
                    loading={loading}
                    title={loading ? host : title}
                    url={loading ? pendingUrl : url}
                    favicon={loading ? '' : favicon}
                />

                {
                    plus && <Options />
                }
            </Container>
        </Wrapper>
    )
}
