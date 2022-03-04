
import { useContext } from 'react'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { SiteProfile } from './SiteProfile'
import { Options } from './Options'
import { ViewContext } from '../ViewContext'

import style from './index.module.scss'


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

        // console.log(e)
        plus && router.push({
            pathname: router.pathname,
            query: router.query,
            hash: ''
        })
    }

    return (
        <div

            className={classNames(
                'control',
                style['control-container'],
                {
                    [style['loading']]: loading || !loaded,
                    [style['plus']]: plus
                }
            )}
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
        </div>
    )
}
