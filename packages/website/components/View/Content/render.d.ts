import type { ComponentProps } from 'react'

import type Blank from './Blank'
import type Failed from './Failed'


type BlankProps = ComponentProps<typeof Blank>

type FailedProps = ComponentProps<typeof Failed>

type BlankUrl = 'about:blank' | ''
type FailedUrl = 'about:failed'

export type InnerUrl = BlankUrl | FailedUrl

interface BlankUrlProps {
    url: BlankUrl
    props: BlankProps
}

interface FailedUrlProps {
    url: FailedUrl
    props: FailedProps
}

export type UrlProps = BlankUrlProps | FailedUrlProps

export type ContentProps<T> = BlankProps | FailedProps | any