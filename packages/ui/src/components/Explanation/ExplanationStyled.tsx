import styled from "@emotion/styled"

export const Wrapper = styled.div`
    width: 255px;
    height: 120px;
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
    padding: 45px 15px;
    top: 50%;
    left: 50%;
    box-sizing: content-box;
    transform: translate(-50%, -50%);
    pointer-events: none;

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
      z-index: 99;
      border-radius: 8px;
      box-shadow: inset 0 0 8px 10px white;
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
    z-index: 2;
    padding: 10px;
    box-sizing: border-box;

    &::-webkit-scrollbar {
      display: none;
    }
`

export const Header = styled.div`
    box-sizing: border-box;

      .word {
        line-height: 1.3;
        font-size: 18px;
        font-weight: 700;
      }
`

export const Content = styled.div`
dl {
    margin: 5px 0 0;
    font-size: 14px;
    line-height: 1.6;

    b {
      font-weight: 700;
      margin-right: 5px;
    }
  }
`

export const CloseButton = styled.div`
  position: absolute;
  z-index: 100;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  padding: 10px;
  margin: -5px;
  color: #5a5a5a;
  cursor: pointer;
  box-sizing: content-box;
  -webkit-tap-highlight-color: transparent;
`