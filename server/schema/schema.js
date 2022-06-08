const { clients, projects } = require('../sampleData.js')
const { buildSchema, GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList } = require('graphql');

// Construct a schema, using GraphQL schema language
// var schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `);

// Client Type
const ClientType = new GraphQLObjectType({
  name: "client",
  fields: () => ({
    id: {type: GraphQLID},
    name : { type : GraphQLString},
    email : { type : GraphQLString},
    phone : { type : GraphQLString},
  })
})

// Project Type
const ProjectType = new GraphQLObjectType({
  name: "project",
  fields: () => ({
    id: {type: GraphQLID},
    client : { 
      type : ClientType,
      resolve(parent,args){
        return clients.find(client => client.id === parent.clientId)
      }
    },
    name : { type : GraphQLString},
    description : { type : GraphQLString},
    status: { type : GraphQLString}
  })
})


const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent,args) {
        return clients;
      }
    },
    client: {
      type: ClientType, 
      args: {id: {type : GraphQLID} },
      resolve(parent,args) {
        return clients.find(client => client.id === args.id);
      } 
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent,args) {
        return projects;
      }
    },
    project: {
      type: ProjectType, 
      args: {id: {type : GraphQLID} },
      resolve(parent,args) {
        return projects.find(project => project.id === args.id);
      } 
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
});