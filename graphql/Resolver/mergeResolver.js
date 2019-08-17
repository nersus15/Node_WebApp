// import packages and modules
const userModel = require('../../models/user');
const eventModel = require('../../models/event');
const { dateToString } = require('../../helpers/date');



// Create function to search data
const userData = async userId => {
    try {
        const UserData = await userModel.findById(userId);
        return {
            ...UserData._doc,
            _id: UserData.id,
            createdEvents: eventsData.bind(this, UserData._doc.createdEvent)
        };

    } catch (err) {
        throw err;
    }
}
const eventsData = async eventsId => {
    try {
        const eventsData = await eventModel.find({ _id: { $in: eventsId } });
        eventsData.map(EventData => {
            return Events(EventData);
        });
        return eventsData;
    } catch (err) {
        throw err;
    }
}

const eventData = async eventId => {
    try {
        const event = await eventModel.findById(eventId);
        return Events(event);
    } catch (err) {
        throw err
    }
}

// function for event
const Events = EventData => {
    return {
        ...EventData._doc,
        _id: EventData.id,
        date: dateToString(EventData._doc.date),
        creator: userData.bind(this, EventData.creator)
    };
}


// function for booking
const Bookings = BookingData => {
    return {
        ...BookingData._doc,
        _id: BookingData.id,
        user: userData.bind(this, BookingData._doc.UserId),
        event: eventData.bind(this, BookingData._doc.EventId),
        createdAt: dateToString(BookingData._doc.createdAt),
        updatedAt: dateToString(BookingData._doc.updatedAt),
    }
}

// exports a function
exports.Bookings = Bookings;
exports.Events = Events;