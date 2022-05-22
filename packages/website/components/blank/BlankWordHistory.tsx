
import Box from "@mui/material/Box"
import Typography from '@mui/material/Typography'

import BrowseIllusSvg from '../../assets/illustration/word_browse.svg?svgr'

export function BlankWordHistory() {

    return (
        <Box className="text-center">
            <Box
                className="max-w-xs p-8 m-auto"
                sx={{
                    aspectRatio: '413/692'
                }}
            >
                <BrowseIllusSvg className="w-full h-full" />
            </Box>
            <Typography
                className="my-8 mx-auto"
                variant="caption"
            >
                阅读中查过的词会出现在这里～
            </Typography>
        </Box>
    )
}