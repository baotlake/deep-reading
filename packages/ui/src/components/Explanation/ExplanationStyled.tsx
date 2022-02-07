import styled from "@emotion/styled"

export const Wrapper = styled.div`
    width: ${255 / 16 + 'em'};
    height: ${120 / 16 + 'em'};
    top: 100px;
    left: 100px;
    position: absolute;

    &.hidden {
        opacity: 0;
        pointer-events: none;
    }
`

export const Box = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    padding: ${45 / 16 + 'em'} ${15 / 16 + 'em'};
    top: 50%;
    left: 50%;
    box-sizing: content-box;
    transform: translate(-50%, -50%);
    pointer-events: none;
    filter: drop-shadow(0 0 ${10 / 16 + 'em'} rgba(0,0,0,0.2));

    > svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        path {
            transition: all 0.2s;
        }
    }
`

export const Main = styled.div`
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    box-sizing: border-box;
    border: 1px solid transparent;
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
      border-radius: ${8 / 16 + 'em'};
      box-shadow: inset 0 0 ${8 / 16 + 'em'} ${10 / 16 + 'em'} white;
      pointer-events: none;
      display: block;
      position: absolute;
    }
`

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    position: relative;
    z-index: 1;
    padding: ${10 / 16 + 'em'};
    box-sizing: border-box;

    &::-webkit-scrollbar {
      display: none;
    }
`

export const Header = styled.div`
    box-sizing: border-box;

      .word {
        line-height: 1.3;
        font-size: ${18 / 16 + 'em'};
        font-weight: 700;
      }
`

export const Content = styled.div`
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

export const CloseButton = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  width: ${20 / 16 + 'em'};
  height: ${20 / 16 + 'em'};
  padding: ${10 / 16 + 'em'};
  margin: ${-5 / 16 + 'em'};
  color: #5a5a5a;
  cursor: pointer;
  box-sizing: content-box;
  -webkit-tap-highlight-color: transparent;
`