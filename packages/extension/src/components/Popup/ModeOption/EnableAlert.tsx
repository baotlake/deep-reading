import Box from "@mui/system/Box"
import { styled } from "@mui/system"
import Alert from "@mui/material/Alert"

const Wrapper = styled(Box)({
    // position: 'absolute',
    // inset: '0 0 0 0',
    // background: 'rgba(255,255,255,0.8)',
    // backdropFilter: 'grayscale(1)',
    // display: 'flex',
})

export function EnableAlert() {

    return (
        <Wrapper>
            <Alert 
                severity="warning"
            >
                请先点击右上角开关启用
            </Alert>
        </Wrapper>
    )
}