const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client"); // capturando o prisma via "destructure assingment"
//com isso já há acesso na camada de dados

// No Graphql trabalha-se com tipo, onde os tipos tem seus "campos", e campos possuem "resolvers"
// resolver são funções que implementam uma lógica para devolver valores para os campos
const resolvers = {
	// mapeia a estrutura que esta no shema.graphql
	Query: {
		user(parent, args, context, info) {
			return prisma.user({ id: args.id });
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
