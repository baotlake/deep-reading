import GlobalStyles from '@mui/material/GlobalStyles'

export function CSSGlobal() {
    const style = {
        'mark[class^="dr-highlight-"]': {
            margin: '0 !important',
            padding: '0 !important',
            color: 'inherit !important',
            fontSize: 'inherit !important',
            fontWeight: 'inherit !important',
            lineHeight: 'inherit !important',
            backgroundColor: 'rgba(0, 194, 255, 0.24)',
        }
    }
    return (
        <GlobalStyles styles={style} />
    )
}