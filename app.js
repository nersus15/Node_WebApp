// Import Packages and moduls
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const eventModel = require('./models/event');

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
            createEvent(inputNewEvent: InputEvent!): Event
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
                date: new Date(args.inputNewEvent.date)
            })
            return EventModel.save().then((result) => {
                console.log(result);
                return { ...result._doc, _id: result._doc._id.toString() };
            }).catch(err => {
                console.log(err);
                throw err;
            });
        }
    },
    graphiql: true,
}))
// Connect to MongoDB Using Mongoose Driver
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-hehyb.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(() => {
        // Setting Listenig Server and connect to server
        app.listen(3001);
    }).catch(err => {
        console.log(err);
    })
