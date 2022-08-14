
import React from 'react'
import { styled } from '@mui/system'
import ButtonGroup from '@mui/material/ButtonGroup'
import Button from '@mui/material/Button'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

const Sheet = styled('div')({

})

const Profile = styled('div')({

})

const Favicon = styled('img')({

})

export function Share() {

    return (
        <Sheet>
            <Profile>
                <Favicon />
                {document.title}
            </Profile>

            <ButtonGroup>
                <Button>{location.href}</Button>
                <Button>
                    <ContentCopyIcon />
                </Button>
            </ButtonGroup>
        </Sheet>
    )
}