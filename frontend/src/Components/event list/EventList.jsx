import React from 'react';

import EventItem from '../../Components/event list/event item/EventItem';

const eventList = (props) => {
    const events = props.events.map(event => {
        return (
            <ul key={event._id}>
                <EventItem
                    eventId={event._id}
                    title={event.title}
                    date={event.date}
                    description={event.description}
                    price={event.price}
                    creatorId={event.creator._id}
                    userId={props.userId}
                    username={event.creator.username}
                    email={event.creator.email}
                    onDetil={props.onViewDetil}
                />
            </ul>
        );
    })
    return (
        <section className='events-list'>{events}</section>
    );
};
export default eventList;