import { styled } from '@mui/system'


export const Box = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  pointer-events: none;

  padding: ${20 / 16 + 'em'} ${30 / 16 + 'em'} ${20 / 16 + 'em'} ${20 / 16 + 'em'};
  width: ${500 / 16 + 'em'};
  max-width: 90vw;
  height: auto;
  border-radius: ${6 / 16 + 'em'};
  border: 1px solid rgba(0,0,0,0.2);
  top: 300px;
  background: white;
  box-shadow: 0 0 ${10 / 16 + 'em'} rgba(0, 0, 0, 0.2);
  line-height: 1.5;
  box-sizing: border-box;

  &.visible {
    opacity: 1;
    pointer-events: all;
  }
`;

export const Button = styled('div')`
  display: block;
  position: absolute;
  top: 0px;
  right: 0px;
  padding: ${5 / 16 + 'em'};
  width: ${20 / 16 + 'em'};
  height: ${20 / 16 + 'em'};
  text-align: center;
  cursor: pointer;
  box-sizing: content-box;
  color: #5a5a5a;
`;
