const { GraphQLServer } = require("graphql-yoga");
const Binding = require("prisma-binding");
const { prisma } = require("./generated/prisma-client"); // capturando o prisma via "destructure assingment"
//com isso já há acesso na camada de dados

const binding = new Binding.Prisma({
	typeDefs: `${__dirname}/generated/graphql-schema/prisma.graphql`,
	endpoint: process.env.PRISMA_ENDPOINT
});

// No Graphql trabalha-se com tipo, onde os tipos tem seus "campos", e campos possuem "resolvers"
// resolver são funções que implementam uma lógica para devolver valores para os campos
const resolvers = {
	// mapeia a estrutura que esta no shema.graphql
	Query: {
		user(parent, args, context, info) {
			/* 			return prisma.user({ id: args.id }).then(user => {
				console.log("user:", user);
				return user;
      }); */
			return binding.query.user({ where: { id: args.id } }, info).then(user => {
				console.log("user:", user);
				return user;
			});
		}
	}
};

/* const server = new GraphQLServer({
  typeDefs: "./schema.graphql",
  resolvers
}); */

const server = new GraphQLServer({
	typeDefs: `${__dirname}/schema.graphql`,
	resolvers
});

server
	.start()
	.then(() => console.log("Server running on http://localhost:4000..."));

/* async function main() {
  await prisma.createUser({
    name: "Ana Fonseca",
    email: "anapf9@gmail.com",
    password: "123456"
  });

  const users = await prisma.users();

  console.log("Users: ", users);
}

main().catch(e => console.error(e)); */
