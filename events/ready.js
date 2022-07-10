module.exports = {
	name: "ready",
	once: true,
	async execute(client, clientUser) {
		console.log(`Ready! Logged in as ${clientUser.user.tag} 🤖.`);
	},
};
