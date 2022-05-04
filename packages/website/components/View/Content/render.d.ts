import type { ComponentProps } from 'react'

import type Blank from './Blank'
import type Failed from './Failed'


type BlankProps = ComponentProps<typeof Blank>

type FailedProps = ComponentProps<typeof Failed>

type BlankUrl = 'about:blank' | ''
type FailedUrl = 'about:failed'
type AboutUrl = `about:${string}`

export type InnerUrl = BlankUrl | FailedUrl | AboutUrl

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