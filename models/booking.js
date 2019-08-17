// import packages and moduls
const mongooge = require('mongoose');
const Schema = mongooge.Schema;

// create schema and models for database
const bookingSchema = new Schema({
    EventId: {
        type: Schema.Types.ObjectId,
        ref: 'eventModel'
    },
    UserId: {
        type: Schema.Types.ObjectId,
        ref: 'userModel'
    }
}, { timestamps: true }
);

// create models and esport module
module.exports = mongooge.model('bookingModel', bookingSchema);