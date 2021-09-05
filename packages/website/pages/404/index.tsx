import { styled } from '@material-ui/core/styles'
import { Typography, Button } from "@material-ui/core"
import HomeIcon from '@material-ui/icons/Home'


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
                    <Button
                        startIcon={<HomeIcon/>}
                        color={"default"}
                        size={"large"}
                        variant={"outlined"}
                    >返回首页</Button>
                </a>
            </ButtonContainer>

        </PageContainer>
    )
}
