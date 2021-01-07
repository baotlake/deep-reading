import React, { useState } from 'react';


import './switch.scss';

function Switch(props) {
    const [status, setStatus] = useState(props.defaultValue);

    const onClick = () => {
        if (typeof props.onChange === 'function')
            props.onChange(!status)
        setStatus(!status);
    }
    return (
        <div
            className={`wrp-switch ${status ? 'wrp-switch-on' : 'wrp-switch-off'}`}
            onClick={onClick}
        >
            <div></div>
        </div>
    )
}

export default Switch;