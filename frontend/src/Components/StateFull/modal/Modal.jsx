import React from 'react';

const modal = props => (
    <div className='modal'>
        <header className='modal-header'>
            <h1 className='modal-title'>{props.title}</h1>
        </header>
        <section className='modal-content'>{props.Child}</section>
        <section className='modal-actions'>
            {props.canCancel && <button onClick={props.onCancel} className='btn btn-danger'>Cancel</button>}
            {props.canConfirm && <button onClick={props.onConfirm} className='btn btn-primary'>Confirm</button>}
        </section>
    </div>
);

export default modal;