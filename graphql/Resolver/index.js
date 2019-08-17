// import packgaes and moduls
const bcrypt = require('bcryptjs');
const eventModel = require('../../models/event');
const userModel = require('../../models/user');
const bookingModel = require('../../models/booking');

// variable for users and events
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
            return {
                ...EventData._doc,
                _id: EventData.id,
                date: new Date(EventData._doc.date).toISOString(),
                creator: userData.bind(this, EventData.creator)
            };
        });
        return eventsData;
    } catch (err) {
        throw err;
    }
}

const eventData = async eventId => {
    try {
        const event = await eventModel.findById(eventId);
        return {
            ...event._doc,
            _id: event.id,
            creator: userData.bind(this, event.creator)
        }
    } catch (err) {
        throw err
    }
}

// make action graphQl and export modul
module.exports = {
    events: async () => {
        try {
            const MyEvents = await eventModel.find();
            return MyEvents.map(MyEvent => {
                return {
                    ...MyEvent._doc,
                    _id: MyEvent.id,
                    date: new Date(MyEvent._doc.date).toISOString(),
                    creator: userData.bind(this, MyEvent._doc.creator)
                };
            })
        } catch (err) {
            throw err
        }
    },
    users: async () => {
        try {
            const MyUsers = await userModel.find();
            return MyUsers.map(MyUser => {
                return {
                    ...MyUser._doc,
                    _id: MyUser.id,
                    createdEvents: eventsData.bind(this, MyUser._doc.createdEvent)
                }
            })
        } catch (err) {
            throw err
        }
    },
    bookings: async () => {
        try {
            const BookingsData = await bookingModel.find();
            return BookingsData.map(BookingData => {
                return {
                    ...BookingData._doc,
                    _id: BookingData.id,
                    user: userData.bind(this, BookingData._doc.UserId),
                    event: eventData.bind(this, BookingData._doc.EventId),
                    createdAt: new Date(BookingData._doc.createdAt).toISOString(),
                    updatedAt: new Date(BookingData._doc.updatedAt).toISOString(),
                }
            })
        } catch (err) {
            throw err
        }
    },
    createEvent: async (args) => {
        const EventModel = new eventModel({
            title: args.inputNewEvent.title,
            description: args.inputNewEvent.description,
            price: +args.inputNewEvent.price,
            date: new Date(args.inputNewEvent.date),
            creator: "5d53792c2a065b47cc14609c"
        });
        try {
            let createdEvent;
            const result = await EventModel.save()
            createdEvent = { ...result._doc, date: new Date(result._doc.date).toISOString(), _id: result._doc._id.toString(), creator: userData.bind(this, result._doc.creator) };
            const user = await userModel.findById("5d53792c2a065b47cc14609c")
            if (!user) {
                throw new Error("User not Found");
            }
            user.createdEvent.push(EventModel);
            await user.save()
            return createdEvent
        } catch (err) {
            throw err;
        }
    },
    createUSer: async (args) => {
        try {
            const User = await userModel.findOne({ email: args.inputNewUSer.email })
            if (User) {
                throw new Error("this email already use");
            }
            const hashedPassword = await bcrypt.hash(args.inputNewUSer.password, 12)
            const UserModel = new userModel({
                username: args.inputNewUSer.username,
                email: args.inputNewUSer.email,
                password: hashedPassword
            });
            const result = await UserModel.save();
            return { ...result._doc, password: "secret", _id: result.id }
        } catch (err) {
            throw err
        }
    },
    bookEvent: async args => {
        const Event = await eventModel.findOne({ _id: args.eventId });
        const booking = new bookingModel({
            UserId: '5d53792c2a065b47cc14609c',
            EventId: Event
        });
        const result = await booking.save();
        return {
            ...result._doc,
            _id: result.id,
            user: userData.bind(this, result._doc.UserId),
            event: eventData.bind(this, result._doc.EventId),
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.updatedAt).toISOString(),
        }
    },
    cancelBooking: async args => {
        try {
            const bookingData = await bookingModel.findById(args.bookingId).populate("EventId")

            const EventId = {
                ...bookingData.EventId._doc,
                _id: bookingData.EventId.id,
                creator: userData.bind(this, bookingData.EventId._doc.creator)
            };
            await bookingModel.deleteOne({ _id: args.bookingId });
            return EventId;
        } catch (err) {
            throw err
        }
    }

}