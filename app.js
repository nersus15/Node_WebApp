// Import Packages and moduls
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const app = express();
const GraphQlSchema = require('./graphql/Schema/index');
const GraphQlResolver = require('./graphql/Resolver/index');

// Use Middleware
app.use(bodyParser.json());

// Desain GraphQl Schema
app.use('/myapi', graphqlHttp({
    schema: GraphQlSchema,
    rootValue: GraphQlResolver,
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
