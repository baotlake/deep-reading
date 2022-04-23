import { Skeleton } from '@mui/material'
import { styled } from '@mui/system'

const Wrapper = styled('div')({
    display: 'flex',
    margin: '10px 0',
})

const ImageBox = styled('div')({
    padding: '16px',
})

const TextBox = styled('div')({
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
})

export function SkeletonItem() {
    return (
        <Wrapper>
            <ImageBox>
                <Skeleton variant="circular" width={48} height={48} />
            </ImageBox>
            <TextBox>
                <Skeleton variant={"text"} height={20} />
                <Skeleton height={40} />
            </TextBox>
        </Wrapper>
    );
}
