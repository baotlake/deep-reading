

export const cardGridStyle = () => ({
    display: 'grid',
    gridColumnGap: '20px',
    gridRowGap: '20px',

    // 40 + 280 + 280 + 20
    '@media screen and (max-width: 620px)': {
        grid: `auto-flow 80px / 1fr`,
    },
    // 620 + 280 + 20
    '@media screen and (min-width: 620px) and (max-width: 920px)': {
        grid: `auto-flow 80px / 1fr 1fr`,
    },
    // 900 + 280 + 20
    '@media screen and (min-width: 920px) and (max-width: 1220px)': {
        grid: `auto-flow 80px / 1fr 1fr 1fr`,
    },
    // 1200 + 280 + 20
    '@media screen and (min-width: 1220px) and (max-width: 1520px)': {
        grid: `auto-flow 80px / 1fr 1fr 1fr 1fr`,
    },
    '@media screen and (min-width: 1520px)': {
        grid: `auto-flow 80px / 1fr 1fr 1fr 1fr 1fr`,
    },
})