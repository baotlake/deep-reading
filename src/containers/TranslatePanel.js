import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash'

import * as explActions from '../actions/explanation';
import * as translateActions from '../actions/translate';

import TranslatePanel from '../components/TranslatePanel';

import Touch from '../utils/touch';

import '../components/translatePanel.scss';

function ManageTranslatePanel(props) {

    const dragTouch = new Touch();

    const slipTouch = useMemo(() => {
        const showStatusMap = {
            hidden: 0,
            half: 1,
            full: 2,
            0: 'hidden',
            1: 'half',
            2: 'full',
        };
        let sumY = 0;
        const slipMoving = (touch, e) => {
            // e.preventDefault();
            e.stopPropagation();
            if (Math.abs(touch.sumY - sumY) < 100) {
                return;
            }

            let showStatus = showStatusMap[touch.data];

            if (touch.sumY - sumY > 100) {
                sumY = touch.sumY
                showStatus -= 1;
                console.log('-', showStatus)
            }

            if (touch.sumY - sumY < -100) {
                sumY = touch.sumY
                showStatus += 1;
                console.log('+', showStatus)
            }

            if (showStatus < 0) showStatus = 0;
            if (showStatus > 2) showStatus = 2;

            if (showStatus !== showStatusMap[touch.data]) {
                // 更新showStatus
                props.setShow(showStatusMap[showStatus]);
                touch.data = showStatusMap[showStatus];
            }
        }

        const slipEnd = () => {
            console.log(':-')
            sumY = 0;
        }
        return new Touch({ onMoving: slipMoving, onEnd: slipEnd })
    }, []);

    return (
        <TranslatePanel
            onSlipStart={slipTouch.start}
            onSlipMove={slipTouch.move}
            onSlipEnd={slipTouch.end}

            show={props.translate.show}
            original={props.translate.original || {}}
            status={props.translate.status}
            translation={props.translate.translation}
        ></TranslatePanel>
    )
}

const mapStateToProps = state => ({
    translate: state.translate
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    tapWord: event => {
        dispatch(explActions.tapWord(event))
    },
    setShow: value => {
        dispatch(translateActions.setShow(value))
    }
})

// export default connect(mapStateToProps, mapDispatchToProps)(TranslatePanel);
export default connect(mapStateToProps, mapDispatchToProps)(ManageTranslatePanel)