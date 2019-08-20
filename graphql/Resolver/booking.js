// import packages and modules
const eventModel = require('../../models/event');
const bookingModel = require('../../models/booking');
const { Bookings, Events } = require('./mergeResolver');

// make action graphQl and export as modul
module.exports = {
    bookings: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("You don't have access ");
        }
        try {
            const BookingsData = await bookingModel.find({ UserId: req.userId });
            return BookingsData.map(BookingData => {
                return Bookings(BookingData)
            })
        } catch (err) {
            throw err
        }
    },
    bookEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("You don't have access ");
        }
        const Event = await eventModel.findOne({ _id: args.eventId });
        const booking = new bookingModel({
            UserId: req.userId,
            EventId: Event
        });
        const result = await booking.save();
        return Bookings(result);
    },
    cancelBooking: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("You don't have access ");
        }
        try {
            const bookingData = await bookingModel.findById(args.bookingId).populate("EventId")

            const EventId = Events(bookingData.EventId);
            await bookingModel.deleteOne({ _id: args.bookingId });
            return EventId;
        } catch (err) {
            throw err
        }
    }

};