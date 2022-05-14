import { styled } from '@mui/system'
import BrowseIllusSvg from '../../assets/illustration/word_browse.svg?svgr'

export const Page = styled('div')({
    padding: `0 0 90px 0`,
    paddingBottom: `calc(env(safe-area-inset-bottom) + 56px + 20px)`,
})

export const Header = styled('header')({
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
})

export const ListContainer = styled('div')({

    '> div': {
        borderBottom: `1px solid rgba(0, 0, 0, 0.1)`,
    },
    '> div:first-child': {
        borderTop: `1px solid rgba(0, 0, 0, 0.1)`,
    }
})

export const EmptyBox = styled('div')({
    width: '60%',
    maxWidth: '300px',
    margin: '30px auto',
    textAlign: 'center',
})

export const BrowseIllus = styled(BrowseIllusSvg)({
    // 413 692
    width: `200px`,
    height: `335px`,
})