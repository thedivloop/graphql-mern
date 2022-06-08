const express = require('express');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');


// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  //rootValue: root,
  graphiql: process.env.NODE_ENV === "development",
}));
app.listen(port,console.log(`Server running on port ${port}`));
console.log(`Running a GraphQL API server at http://localhost:${port}/graphql`);