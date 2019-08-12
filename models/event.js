// import packages and moduls
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create new mongoDB schema
const eventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
});

// create mongoDB model
module.exports = mongoose.model('eventModel', eventSchema);