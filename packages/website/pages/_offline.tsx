import { styled } from '@mui/system'
import { Typography, Button } from "@mui/material"
import CachedIcon from '@mui/icons-material/Cached'

import OfflineSvg from '../assets/illustration/offline.svg?svgr'

export const Page = styled('div')({
    textAlign: 'center',
    marginTop: '5em',

    '> svg': {
        width: '80%',
        margin: 'auto',
        filter: ''
    }
})


export default function Offline() {

    const handleClick = () => {
        location.reload()
    }

    return (
        <Page onClick={handleClick}>
            <Typography 
                variant="h1" 
                sx={{ textAlign: 'center', fontSize: '2em' }}
            >
                网络似乎出现问题
            </Typography>

            <OfflineSvg />

            <div className="text-gray-600">
                点击页面刷新 <CachedIcon />
            </div>
        </Page>
    )
}