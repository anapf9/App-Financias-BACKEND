const { GraphQLServer } = require("graphql-yoga");
const Binding = require("prisma-binding");
const { prisma } = require("./generated/prisma-client"); // capturando o prisma via "destructure assingment"
//com isso já há acesso na camada de dados

const resolvers = require("./resolvers");

const env = process.env;
const endpoint = `${env.PRISMA_ENDPOINT}/${env.PRISMA_SERVICE}/${env.PRISMA_STAGE}`;
// mapeia a estrutura que esta no shema.graphql

/* const binding = new Binding.Prisma({
  typeDefs: `${__dirname}/generated/graphql-schema/prisma.graphql`,
  endpoint: process.env.PRISMA_ENDPOINT
}), */

// No Graphql trabalha-se com tipo, onde os tipos tem seus "campos", e campos possuem "resolvers"
// resolver são funções que implementam uma lógica para devolver valores para os campos

const server = new GraphQLServer({
	typeDefs: `${__dirname}/schema.graphql`,
	resolvers,
	context: request => ({
		...request,
		db: new Binding.Prisma({
			typeDefs: `${__dirname}/generated/graphql-schema/prisma.graphql`,
			endpoint
		}),
		prisma
	})
});

server
	.start()
	.then(() => console.log("Server running on http://localhost:4000..."));
