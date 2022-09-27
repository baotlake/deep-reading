import { styled } from '@mui/material/styles'
import { closeButtonStyle } from '../../style'
import { config } from './boxConfig'

const { arrowSize, borderRadius, shadowRadius } = config

export const Wrapper = styled('div')`
  position: absolute;
  top: 0;
  left: 50;

  padding: ${20 / 16 + 'em'} ${30 / 16 + 'em'} ${20 / 16 + 'em'} ${20 / 16 + 'em'};
  width: ${340 / 16 + 'em'};
  min-width: ${240 / 16 + 'em'};
  max-width: 80vw;
  height: auto;
  top: 300px;
  line-height: 1.5;
  box-sizing: border-box;

  &.hidden {
    opacity: 0;
    pointer-events: none;
    display: none;
  }
`;

export const BorderBox = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'white',
  zIndex: -1,
  willChange: 'filter',
  filter: `drop-shadow(0 0 ${shadowRadius / 16}em rgba(0,0,0,0.2))`,
  borderRadius: borderRadius / 16 + 'em',
  border: '0.5px solid rgba(0,0,0,0.2)',
  '--left': '50%',
  '--top': 'auto',
  '--bottom': 'auto',
  '--border-color': 'transparent',


  '&::before': {
    content: '" "',
    display: 'block',
    position: 'absolute',
    width: arrowSize / 16 + 'em',
    height: arrowSize / 16 + 'em',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    background: 'white',
    left: 'var(--left)',
    top: 'var(--top)',
    bottom: 'var(--bottom)',
    borderStyle: 'solid',
    borderWidth: '0.5px',
    borderColor: 'var(--border-color)'
  },

  '&.up': {
    '--top': 0,
    '--border-color': 'rgba(0,0,0,0.2) rgba(0,0,0,0.2) transparent transparent',
  },

  '&.down': {
    '--top': '100%',
    '--border-color': 'transparent transparent rgba(0,0,0,0.2) rgba(0,0,0,0.2)',
  }
})

export const Button = styled('div')({
  ...closeButtonStyle(20 / 16 + 'em'),
  padding: 5 / 16 + 'em',
})

export const Content = styled('div')({

  blockquote: {
    margin: 0,
  },

  p: {
    margin: '1em 0 0',
  }
})