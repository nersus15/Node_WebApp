import React from 'react';
const eventItem = (props) => {
    return (
        <div key={props.eventId} className="card events">
            <div className='card-header'>
                <h1 className='events-title'>{props.title}</h1>
                <small className="events-date">{props.date}</small>
            </div>
            <hr />
            <div className="card-body">
                <p className='events-descriptions'>{props.description}</p>
                <p className='events-price'>Rp.{props.price}</p>
                <div className="event-creator">
                    <p className='creator'>Creator:</p>
                    <p className='username'>Username: {props.username}</p>
                    <p className='email'>Email: {props.email}</p>
                </div>
            </div>
        </div>
    );
};
export default eventItem; 