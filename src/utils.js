// extrair o token do cabeçalho e verificar se o token é valido ou não
const jwt = require("jsonwebtoken");

function getUserId(context) {
	//o graphql usa o express
	// "Authorization": "Bearer <token_jwt>"
	const Authorization = context.request.get("Authorization");
	if (Authorization) {
		const token = Authorization.replace("Bearer ", "");
		const { userId } = jwt.verify(token, process.env.JWT_SECRET);
		return userId;
	}

	throw new Error("Not Authenticated!");
}
module.exports = {
	getUserId
};
