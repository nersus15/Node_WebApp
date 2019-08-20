import React from 'react';
const eventItem = (props) => {
    return (
        <li key={props.eventId} className="card">
            <div>
                <h1 className='event-title'>{props.title}</h1>
                <h2 className='event-price'>Rp.{props.price} - {new Date(props.date).toLocaleDateString()}</h2>
            </div>
            <div>
                {props.creatorId === props.userId ?
                    (<p>Your the owner of this Event</p>) : (
                        <button onClick={props.onDetil.bind(this, props.eventId)} className='btn btn-info'>View Detil</button>
                    )}
            </div>
        </li>
    );
};
export default eventItem; 