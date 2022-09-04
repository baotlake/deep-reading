import { styled } from '@mui/system'
import { config } from './config'
import { svgBorderStyle, closeButtonStyle } from '../../style'

const { width, height, shadowRadius, arrowHeight, borderRadius } = config

const svgPaddingY = arrowHeight + shadowRadius
const svgPaddingX = shadowRadius

export const Wrapper = styled('div')({
  width: width / 16 + 'em',
  height: height / 16 + 'em',
  top: 100,
  left: 100,
  position: 'absolute',

  '&.hidden': {
    opacity: 0,
    'pointer-events': 'none',
    display: 'none',
  }
})

export const BorderBox = styled('div')({
  ...svgBorderStyle,
  filter: `drop-shadow(0 3px ${shadowRadius / 16 + 'em'} rgba(0,0,0,0.2))`,
  padding: `${svgPaddingY / 16 + 'em'} ${svgPaddingX / 16 + 'em'}`,
})

export const Main = styled('div')`
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    box-sizing: border-box;
    /* border: 1px solid transparent; */
    // height: calc(100% - 2px);
    // width: calc(100% - 2px);
    // top: 1px;
    // left: 1px;

    &::after {
      content: ' ';
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 1;
      border-radius: ${borderRadius / 16 + 'em'};
      box-shadow: inset 0 0 ${3 / 16 + 'em'} ${3 / 16 + 'em'} white;
      pointer-events: none;
      display: block;
      position: absolute;
    }
`

export const Container = styled('div')`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    position: relative;
    z-index: 1;
    padding: ${10 / 16 + 'em'};
    box-sizing: border-box;
    border: 1px solid transparent;

    &::-webkit-scrollbar {
      display: none;
    }
`

export const Header = styled('div')`
    box-sizing: border-box;

      .word {
        line-height: 1.3;
        font-size: ${18 / 16 + 'em'};
        font-weight: 700;
      }
`

export const Content = styled('div')`
  dl {
    font-size: ${14 / 16 + 'em'};
    margin: ${5 / 14 + 'em'} 0 0;
    line-height: 1.6;
    font-weight: normal;

    b {
      font-weight: 700;
      margin-right: 5px;
    }
  }
`

export const CloseButton = styled('div')({
  ...closeButtonStyle(20 / 16 + 'em'),
  zIndex: 1,
  padding: 10 / 16 + 'em',
  margin: -5 / 16 + 'em',
})