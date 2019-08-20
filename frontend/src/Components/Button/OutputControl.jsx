// import packages dan moduls
import React from 'react';


const OutputControl = (props) => {
    return (
        <div className='output-type'>
            <button className={props.outputType === 'list' ? 'active' : ''} onClick={props.changeOutputHandler.bind(this, 'list')}>{props.buttonText_1}</button>
            <button className={props.outputType === 'chart' ? 'active' : ''} onClick={props.changeOutputHandler.bind(this, 'chart')}>{props.buttonText_2}</button>
        </div>
    );
}

export default OutputControl;