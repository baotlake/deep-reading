import React from 'react';
import { get } from 'lodash';

import './translatePanel.scss';

const TranslatePanel = (props) => {

    const showStyle = {
        hidden: {
            bottom: "-18rem",
            height: '16rem',
        },
        half: {
            bottom: 0,
            height: '12rem',
        },
        full: {
            bottom: 0,
            height: '36rem',
            maxHeight: '80%',
        }
    }

    console.log('props', props)

    let show = props.show || 'hidden'
    let panelStyle = Object.assign({}, showStyle[show]);

    return (
        <div id="tp" className="wrp-translate-panel" style={panelStyle}
            onTouchStart={(e) => props.onSlipStart(e, props.show)}
            onTouchMove={props.onSlipMove}
            onTouchEnd={props.onSlipEnd}
            // onMouseMove={(e)=>this.handleMouseMove(e)}
            // onMouseDown={(e)=>this.handleMouseDown(e)}
            // onMouseUp={(e)=>this.handleMouseUp(e)}
            // onMouseLeave={(e)=>this.handleMouseLeave(e)}
            onClick={props.handleClick}
        >
            <div className="wrp-tp-handle"
                onTouchMove={props.handleDrag}
                onClick={props.setTranslateY}
            >
                <div ref={props.handleEl} />
            </div>

            <div className="">{props.original.elements}</div>
            <br />
            <div className="">
                {(props.status == "completed") ? props.translation.text : ''}
            </div>
            <div class="wrp-tr-scall-mask">
                <div></div>
            </div>
        </div>
    )
}

export default TranslatePanel