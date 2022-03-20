import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
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
    const router = useRouter()

    useEffect(() => {
        router.replace('/404?path=' + encodeURIComponent(router.asPath))
    }, [])

    return (
        <>
            <Head>
                <title>404 - Deep Reading</title>
            </Head>
    
            <PageContainer>
                <Typography align="center" variant="h1">404</Typography>
                <Typography align="center" variant="subtitle1">找不到该页面</Typography>
                <ButtonContainer>
                    <Link href="/start">
                        <Button startIcon={<HomeIcon />} size="large" variant="outlined">返回首页</Button>
                    </Link>
                </ButtonContainer>
            </PageContainer>
        </>
    )
}
