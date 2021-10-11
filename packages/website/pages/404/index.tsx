import { styled } from '@mui/material/styles'
import { Typography, Button } from "@mui/material"
import HomeIcon from '@mui/icons-material/Home'


const PageContainer = styled('div')({
    margin: '200px 0 0',
})

const ButtonContainer = styled('div')({
    marginTop: '20px',
    textAlign: 'center',
})

export default function NotFound() {

    return (
        <PageContainer>
            <Typography align={"center"} variant={"h1"}>404</Typography>
            <ButtonContainer>
                <a href={"/"}>
                    <Button startIcon={<HomeIcon/>} size={"large"} variant={"outlined"}>返回首页</Button>
                </a>
            </ButtonContainer>

        </PageContainer>
    );
}
