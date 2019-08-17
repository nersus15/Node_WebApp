// import packages and modules
const eventModel = require('../../models/event');
const { Events } = require('./mergeResolver');


//  make action graphQl and export as modul
module.exports = {
    events: async () => {
        try {
            const MyEvents = await eventModel.find();
            return MyEvents.map(MyEvent => {
                return Events(MyEvent);
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
            createdEvent = Events(result)
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
    }
};