// import packages and modules
const eventModel = require('../../models/event');
const bookingModel = require('../../models/booking');
const { Bookings, Events } = require('./mergeResolver');

// make action graphQl and export as modul
module.exports = {
    bookings: async () => {
        try {
            const BookingsData = await bookingModel.find();
            return BookingsData.map(BookingData => {
                return Bookings(BookingData)
            })
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
        return Bookings(result);
    },
    cancelBooking: async args => {
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