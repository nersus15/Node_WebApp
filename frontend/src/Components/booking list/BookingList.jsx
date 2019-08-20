import React from 'react';

const BookingList = (props) => {
    return (
        <ul className='card-booking'>
            {props.myBookings.map(mybooking => {
                return (
                    <li key={mybooking._id} className='bookings-item'>
                        <div className='bookings-data'>
                            <div className='booking-event' >
                                <h1>{mybooking.event.title}</h1>
                                <h2>{mybooking.event.description}</h2>
                                <p>Rp.{mybooking.event.price}</p>
                                <p>Date: {new Date(parseInt(mybooking.event.date)).toLocaleDateString()}</p>
                                <small>Booking at: {new Date(mybooking.createdAt).toLocaleDateString()}</small>
                            </div>
                            <div className='event-creator'>
                                <p>Creator:</p>
                                <h2> {mybooking.event.creator.username}</h2>
                            </div>
                        </div>
                        <div className='bookings-action'>
                            <button onClick={props.onDelete.bind(this, mybooking._id)} className='btn btn-danger'>Cancel</button>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
export default BookingList;