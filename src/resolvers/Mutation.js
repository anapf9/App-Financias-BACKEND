const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getUserId } = require("./../utils");

const JWT_SECRET = process.env.JWT_SECRET;

async function createAccount(_, { description }, ctx, info) {
	const userId = getUserId(ctx);
	return ctx.db.mutation.createAccount(
		{
			data: {
				description,
				user: {
					connect: {
						id: userId
					}
				}
			}
		},
		info
	);
}

function createCategory(_, { description, operation }, ctx, info) {
	const userId = getUserId(ctx);
	return ctx.db.mutation.createCategory(
		{
			data: {
				description,
				operation,
				user: {
					connect: {
						id: userId
					}
				}
			}
		},
		info
	);
}

async function login(_, { email, password }, ctx, info) {
	// via destructure extraimos os argumentos desejados
	// abaixo tentamos buscar um usuario pelo email que estamos recebendo
	const user = await ctx.db.query.user({ where: { email } });
	if (!user) {
		throw new Error("Invalid credential!");
	}

	const valid = await bcrypt.compare(password, user.password);
	if (!valid) {
		throw new Error("Invalid credential!");
	}

	const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "2h" });

	return {
		token,
		user
	};
}

async function singup(_, args, ctx, info) {
	const password = await bcrypt.hash(args.password, 10);
	const user = await ctx.db.mutation.createUser({
		data: { ...args, password }
	});

	const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "2h" });
	return {
		token,
		user
	};
}

module.exports = {
	createAccount,
	createCategory,
	login,
	singup
};
