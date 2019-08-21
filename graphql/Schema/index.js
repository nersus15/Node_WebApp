// import packages and moduls
const { buildSchema } = require('graphql');

// build and export GraphQl schema as module
module.exports =
    buildSchema(`
        type Booking{
            _id:ID!
            event:Event!
            user:User!
            createdAt:String!
            updatedAt: String!
        }
        type Event{
            _id:ID!
            title: String!
            description: String!
            price: Float!
            date: String!
            creator:User!
        }
        type User{
            _id:ID!
            username: String!
            email:String!
            password:String!
            createdEvents: [Event!]
        }
        type AuthData{
            userId:ID!
            token:String!
            tokenExp:Int!
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
            users:[User!]!
            bookings:[Booking!]!
            login(email:String!, password:String!):AuthData!
        }
        type defaultMutation{
            createEvent(inputNewEvent: InputEvent!): Event
            createUSer(inputNewUSer: InputUser!): User
            bookEvent(eventId:ID!):Booking!
            cancelBooking(bookingId:ID!):Event!
            deleteEvent(eventId:ID!):Event!
        }
        schema{
            query: defaultQuery,
            mutation: defaultMutation
        }
    `)