import React from 'react';

import EventItem from '../../Components/event list/event item/EventItem';

const eventList = (props) => {
    const events = props.events.map(event => {
        return (
            <EventItem
                eventId={event._id}
                title={event.title}
                date={event.date}
                description={event.description}
                price={event.price}
                username={event.creator.username}
                email={event.creator.email}
            />
        );
    })
    return <section className='events-list'>{events}</section>


};
export default eventList;