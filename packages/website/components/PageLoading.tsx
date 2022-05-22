import styled from "@emotion/styled"
import LogoSvg from '../assets/logo_name.svg?svgr'

const Container = styled.div({
    position: `absolute`,
    width: `100vw`,
    // height: `100vh`,
    height: `calc(100vh - 56px)`,
    top: 0,
    left: 0,
    background: `rgba(0,0,0,0.05)`,
    display: `flex`,
    paddingBottom: `env(safe-area-inset-bottom)`,
})

const Box = styled.div`
    width: 182px;
    margin: auto;
    text-align: center;
    animation: pulse 1.6s ease-in-out infinite;

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

const StyledLogoSvg = styled(LogoSvg)({
    width: '182px',
    height: '66px',
})

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
                    <StyledLogoSvg />
                </Box>
            </Container>
        </>
    )
}