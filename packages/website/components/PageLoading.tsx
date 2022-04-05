import styled from "@emotion/styled"
import LogoSvg from '../assets/svg/logo.svg?svgr'

const Container = styled.div`
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.05);
    display: flex;
`

const Box = styled.div`
    width: 150px;
    margin: auto;
    text-align: center;
    animation: pulse 1.2s ease-in-out infinite;

    > svg {
        display: inline-block;
        width: 83px;
        height: 64px;
    }

    @keyframes pulse {
        from {
            -webkit-transform: scale3d(1, 1, 1);
            transform: scale3d(1, 1, 1);
        }

        50% {
            -webkit-transform: scale3d(1.05, 1.05, 1.05);
            transform: scale3d(1.05, 1.05, 1.05);
        }

        to {
            -webkit-transform: scale3d(1, 1, 1);
            transform: scale3d(1, 1, 1);
        }
    }
`

const Lable = styled.div`
    margin-top: 10px;
    font-size: 18px;
    color: rgba(0,0,0,0.6);
    font-weight: bold;
`

export default function PageLoading() {

    return (
        <>
            <Container>
                <Box>
                    <LogoSvg />
                    <Lable>Deep Reading</Lable>
                </Box>
            </Container>
        </>
    )
}