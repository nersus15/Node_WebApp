// Import Packages and moduls
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const eventModel = require('./models/event');
const userModel = require('./models/user');
const bcrypt = require('bcryptjs');

const app = express();

// Use Middleware
app.use(bodyParser.json());

// Desain GraphQl Scheme
app.use('/myapi', graphqlHttp({
    schema: buildSchema(`
       type Event{
           _id:ID!
           title: String!
           description: String!
           price: Float!
           date: String!
       }
       type User{
           _id:ID!
           username: String!
           email:String!
           password:String!
       }
       input InputUser{
           username:String!
           email:String!
           password:String!
       }
       input InputEvent{
           title: String!
           description: String
           price: Float!
           date: String!           
       }

       type defaultQuery{
            events: [Event!]!
        }
       type defaultMutation{
            createEvent(inputNewEvent: InputEvent!): Event,
            createUSer(inputNewUSer: InputUser!): User
        }
        schema{
            query: defaultQuery,
            mutation: defaultMutation
        }
    `),
    rootValue: {
        events: () => {
            return eventModel.find().then((MyEvents) => {
                return MyEvents.map(MyEvent => {
                    return { ...MyEvent._doc, _id: MyEvent.id }
                })
            }).catch(err => {
                throw err
            })
        },
        createEvent: (args) => {
            const EventModel = new eventModel({
                title: args.inputNewEvent.title,
                description: args.inputNewEvent.description,
                price: +args.inputNewEvent.price,
                date: new Date(args.inputNewEvent.date),
                creator: "5d5237f4b8ece01cf446fe2c"
            });
            let createdEvent;
            return EventModel
                .save()
                .then((result) => {
                    createdEvent = { ...result._doc, _id: result._doc._id.toString() };
                    return userModel.findById("5d5237f4b8ece01cf446fe2c")
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

    },
    graphiql: true,
}))
// Connect to MongoDB Using Mongoose Driver
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-hehyb.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, { useNewUrlParser: true })
    .then(() => {
        // Setting Listenig Server and connect to server
        app.listen(3001);
    }).catch(err => {
        console.log(err);
    })
