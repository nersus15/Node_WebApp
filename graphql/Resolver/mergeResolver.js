// import packages and modules
const userModel = require('../../models/user');
const eventModel = require('../../models/event');
const { dateToString } = require('../../helpers/date');
const DataLoader = require('dataloader');

// Data Loader for events
const eventLoader = new DataLoader((eventsId) => {
    return eventsData(eventsId)
});
// Data Loader for User
const userLoader = new DataLoader(usersId => {
    return userModel.find({ _id: { $in: usersId } });
});

// Create function to search data
const userData = async userId => {
    try {
        const UserData = await userLoader.load(userId.toString());
        return {
            ...UserData._doc,
            _id: UserData.id,
            createdEvents: () => eventLoader.loadMany(UserData._doc.createdEvent)
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
        const event = await eventLoader.load(eventId.toString());
        return {
            ...event._doc,
            creator: userData.bind(this, event._doc.creator)
        };
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
        creator: userData.bind(this, EventData.creator),
    };

}

// function for user
const Users = UserData => {
    return {
        ...UserData._doc,
        _id: UserData.id,
        createdEvents: () => eventLoader.loadMany(UserData._doc.createdEvent)
    }

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
exports.Users = Users;