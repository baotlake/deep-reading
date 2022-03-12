import styled from "@emotion/styled"

import Button from '@mui/material/Button'

export const Box = styled.div`
    position: fixed;
    bottom: ${-160 / 16 + 'em'};
    display: flex;
    width: 80%;
    max-width: ${300 / 16 + 'em'};
    left: 50%;
    transform: translateX(-50%);
    transition: all 0.3s cubic-bezier(0.42, 1.02, 0.7, 1.09);
    box-shadow: 0 0 ${10 / 16 + 'em'} rgba(0, 0, 0, 0.2);
    pointer-events: all;
    overflow: hidden;
    z-index: 99;
    border-radius: ${6 / 16 + 'em'};

    &.visible {
        bottom: ${72 / 16 + 'em'};
    }
`

export const UrlBox = styled.div`
    user-select: none;
    height: 100%;
    width: 80%;
    line-height: ${28 / 16 + 'em'};
    height: ${40 / 16 + 'em'};
    padding: ${6 / 16 + 'em'} ${10 / 16 + 'em'};
    box-sizing: border-box;
    border-radius: ${6 / 16 + 'em'} 0 0 ${6 / 16 + 'em'};
    background-color: white;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-right-color: transparent;
    overflow-x: auto;

    &::-webkit-scrollbar {
      display: none;
    }
`

export const GoButton = styled(Button)`
    height: ${40 / 16 + 'em'};
    width: ${40 / 16 + 'em'};
    display: flex;
    flex-direction: column;
    font-size: inherit;
    font-weight: bold;
    border-radius: 0;
    background: #1b82fe;
    color: white;
    border-radius: 0 ${6 / 16 + 'em'} ${6 / 16 + 'em'} 0;
`