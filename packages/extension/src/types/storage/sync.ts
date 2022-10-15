import type { TargetType } from '@wrp/core'

type HostMode = {
    host_mode: TargetType
}

type Enable = {
    enable: boolean
}

export type SyncStorage = HostMode & Enable
