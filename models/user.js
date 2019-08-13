// import packgaes and moduls
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdEvent: [
        {
            type: Schema.Types.ObjectId,
            ref: 'eventModel'
        }
    ]
});

// create model and export modul
module.exports = mongoose.model('userModel', userSchema);