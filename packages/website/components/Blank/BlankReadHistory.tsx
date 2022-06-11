/// <reference path="../../module.d.ts" />

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import classNames from 'classnames'

import HistoryIllus from '../../assets/illustration/history.svg?svgr'


type Props = {
    className?: string
}

export function BlankReadHistory({ className }: Props) {

    return (
        <Box
            className={classNames("px-5 text-center", className)}
        >
            <Box
                className="relative max-w-md m-auto"
                sx={{
                    aspectRatio: '900/600'
                }}
            >
                <HistoryIllus
                    className="w-full h-full"
                />
            </Box>
            <Typography
                variant="caption"
            >
                没有任何记录哎～
            </Typography>
        </Box>
    )
}