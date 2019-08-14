// import packgaes and moduls
const bcrypt = require('bcryptjs');
const eventModel = require('../../models/event');
const userModel = require('../../models/user');


// variable for users and events
const userData = userId => {
    return userModel.findById(userId)
        .then(UserData => {
            return {
                ...UserData._doc,
                _id: UserData.id,
                createdEvents: eventData.bind(this, UserData._doc.createdEvent)
            };
        })
        .catch(err => {
            throw err;
        });
}
const eventData = eventsId => {
    return eventModel.find({ _id: { $in: eventsId } })
        .then(EventsData => {
            return EventsData.map(EventData => {
                return {
                    ...EventData._doc,
                    _id: EventData.id,
                    date: new Date(EventData._doc.date).toISOString(),
                    creator: userData.bind(this, EventData.creator)
                };
            });
        })
        .catch(err => {
            throw err;
        });
}

// export modul
module.exports = {
    events: () => {
        return eventModel.find().then((MyEvents) => {
            return MyEvents.map(MyEvent => {
                return {
                    ...MyEvent._doc,
                    _id: MyEvent.id,
                    date: new Date(MyEvent._doc.date).toISOString(),
                    creator: userData.bind(this, MyEvent._doc.creator)
                };
            })
        })
            .catch(err => {
                throw err
            })
    },
    createEvent: (args) => {
        const EventModel = new eventModel({
            title: args.inputNewEvent.title,
            description: args.inputNewEvent.description,
            price: +args.inputNewEvent.price,
            date: new Date(args.inputNewEvent.date),
            creator: "5d5237e2b8ece01cf446fe2b"
        });
        let createdEvent;
        return EventModel
            .save()
            .then((result) => {
                createdEvent = { ...result._doc, date: new Date(result._doc.date).toISOString(), _id: result._doc._id.toString(), creator: userData.bind(this, result._doc.creator) };
                return userModel.findById("5d5237e2b8ece01cf446fe2b")
            })
            .then(user => {
                if (!user) {
                    throw new Error("User not Found");
                }
                user.createdEvent.push(EventModel);
                return user.save()
            })
            .then(res => {
                return createdEvent
            })
            .catch(err => {
                throw err;
            });
    },
    createUSer: (args) => {
        return userModel.findOne({ email: args.inputNewUSer.email }).then(User => {
            if (User) {
                throw new Error("this email already use");
            }
            return bcrypt.hash(args.inputNewUSer.password, 12)
        })
            .then(hashedPassword => {
                const UserModel = new userModel({
                    username: args.inputNewUSer.username,
                    email: args.inputNewUSer.email,
                    password: hashedPassword
                });
                return UserModel.save();
            })
            .then(result => {
                return { ...result._doc, password: "secret", _id: result.id }
            })
            .catch(err => {
                throw err
            })

    }

}