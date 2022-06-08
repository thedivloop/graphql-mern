const Project = require('../models/Project')
const Client = require('../models/Client')
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType} = require('graphql');



// Client Type
const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: {type: GraphQLID},
    name : { type : GraphQLString},
    email : { type : GraphQLString},
    phone : { type : GraphQLString},
  }),
})

// Project Type
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: {type: GraphQLID},
    name : { type : GraphQLString},
    description : { type : GraphQLString},
    status: { type : GraphQLString},
    client : { 
      type : ClientType,
      resolve(parent,args){
        return Client.findById(parent.clientId);
      }
    },
  })
})


const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent,args) {
        return Client.find();
      }
    },
    client: {
      type: ClientType, 
      args: {id: {type : GraphQLID} },
      resolve(parent,args) {
        return Client.findById(args.id);
      } 
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent,args) {
        return Project.find();
      }
    },
    project: {
      type: ProjectType, 
      args: {id: {type : GraphQLID} },
      resolve(parent,args) {
        return Project.findById(args.id);
      } 
    }
  }
})

// Mutations
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addClient: {
      type: ClientType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        email: {type: new GraphQLNonNull(GraphQLString)},
        phone: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve(parent,{name, email, phone}) {
        const client = new Client({
          name,
          email,
          phone
        });

        return client.save();
      }
    },
    deleteClient: {
      type: ClientType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
      },
      resolve(parent,{id}) {
        return Client.findByIdAndRemove(id);
      }
    },
    addProject: {
      type: ProjectType,
      args: {
        clientId: {type: new GraphQLNonNull(GraphQLID)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        description: {type: new GraphQLNonNull(GraphQLString)},
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatus',
            values: {
              'new': { value: 'Not Started'},
              'progress': { value: 'In Progress'},
              'completed': { value: 'Completed'},
            }
          }),
          defaultValue: 'Not Started'
        },
      },
      resolve(parent,{clientId, name, description, status}) {
        const project = new Project({
          clientId,
          name,
          description,
          status
        });
        console.log(project);
        return project.save();
      }
    },
    deleteProject: {
      type: ProjectType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
      },
      resolve(parent,{id}) {
        return Project.findByIdAndRemove(id);
      }
    },
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});