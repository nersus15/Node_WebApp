// Import Packages
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

// global Vaiable
const Events = [];

// Use Middleware
app.use(bodyParser.json());

// Desain GraphQl Scheme
app.use('/myapi', graphqlHttp({
    schema: buildSchema(`
       type Event{
           _id:ID!
           title: String!
           description: String
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
            return Events;
        },
        createEvent: (args) => {
            const newEvent = {
                _id: Math.random().toString(),
                title: args.inputNewEvent.title,
                description: args.inputNewEvent.description,
                price: +args.inputNewEvent.price,
                date: args.inputNewEvent.date
            };
            Events.push(newEvent);
            return newEvent;
        }
    },
    graphiql: true,
}))

// Setting Listenig Server
app.listen(3001);