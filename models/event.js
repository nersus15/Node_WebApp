// import packages and moduls
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create new mongoDB schema
const eventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'userModel'
    }
});

// create mongoDB model and export the modul
module.exports = mongoose.model('eventModel', eventSchema);