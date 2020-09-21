import React, {useState} from 'react'
import { get } from 'lodash'

import './translatePanel.css';
handleTouchSlip: (e) => {
    // console.log('touch slip')
    e.stopPropagation();
    if(touchRecord.moving == false){
        touchRecord.lastY = e.touches[0].clientY;
        touchRecord.slipY = 0;
        touchRecord.moving = true;
        setTimeout(()=>{
            touchRecord.moving = false;
            touchRecord.slipNum = 0;
        }, 150);
    }else{
        touchRecord.slipY = touchRecord.slipY + e.touches[0].clientY - touchRecord.lastY;
        
        let status = 0;
        if(ownProps.translate.show == "half"){
            status = 1;
        }else if(ownProps.translate.show == "full"){
            status = 2;
            this.setTranslateY(0);
        }

        if(touchRecord.slipY > 100 && touchRecord.slipNum == 0){
            status = status - 1;
            touchRecord.slipY = 0;
            touchRecord.slipNum = 1;
        }else if(touchRecord.slipY < -100 && touchRecord.slipNum == 0){
            status = status + 1;
            touchRecord.slipY = 0;
            touchRecord.slipNum = 1;
        }

        if(status < 0)status = 0;
        if(status > 2)status = 2;
        let show = ['hidden', 'half', 'full'][status];

        if(ownProps.translate.show == show) return;

        dispatch(translateActions.setShow(show))

    }
}
const TranslatePanel = (props) => {

    // console.log('extract',targetId, this.targetId);
    // const [show, setShow] = useState('hidden')
    // const [status, setStatus] = useState(0)

    // this.setState({
    //     showStatus:'half',
    //     status:0,
    // })

    console.log('call this.translate()')
    // this.translate();
    // this.movingRecord.sumY = 0;
    // this.setTranslateY(0);
    // this.count = count;


    // if(this.state.showStatus == 'hidden') this.targetId = null;

    let showStyle={
        hidden:{
            bottom:"-85%",
            height:'80%',
        },
        half:{
            bottom:"-45%",
            height:'80%',
        },
        full:{
            bottom:0,
            height:'80%',
        }
    }

    console.log('props', props)

    let show = props.translate.show || 'hidden'

    let panelStyle = Object.assign({}, showStyle[show]);
    let original = props.translate.original || {}
    let status = props.translate.status
    let translation = props.translate.translation

    return (
        <div id="tp" className="wrp-translate-panel" style={panelStyle}
            onTouchMove={(e)=>props.handleTouchSlip(e)}
            // onMouseMove={(e)=>this.handleMouseMove(e)}
            // onMouseDown={(e)=>this.handleMouseDown(e)}
            // onMouseUp={(e)=>this.handleMouseUp(e)}
            // onMouseLeave={(e)=>this.handleMouseLeave(e)}
            onClick={(e)=>{
                e.stopPropagation()
                props.tapWord(e)
            }}
        >
            <div className="wrp-tp-handle" 
                onTouchMove={(e)=>this.handleDrag(e)} 
                onClick={()=>this.setTranslateY(0)} 
            />

            <div className="">{original.elements}</div>
            <br/>
            <div className="">
                {(status == "completed") ? translation.text :''}
            </div>

        </div>
    )
}

export default TranslatePanel